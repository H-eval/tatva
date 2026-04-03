const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const mongoose = require("mongoose");

const Sentence = require("../models/Sentence");
const Translator = require("../models/Translator");
const Translation = require("../models/Translation");
const parseFile = require("../utils/fileParser");
const runAutoEvaluation = require("../scripts/autoEvaluation");
const Reference = require("../models/Reference");

// ─── helpers ────────────────────────────────────────────────────────────────

function normaliseId(id) {
  return String(id).replace(/[^0-9]/g, "").trim();
}

function sortBySID(arr) {
  return [...arr].sort(
    (a, b) => Number(normaliseId(a.S_ID)) - Number(normaliseId(b.S_ID))
  );
}

function checkAlignment(base, other, label) {
  if (base.length !== other.length) {
    return {
      aligned: false,
      reason: `${label} has ${other.length} sentences but base has ${base.length}`,
    };
  }

  const sortedBase = sortBySID(base);
  const sortedOther = sortBySID(other);

  for (let i = 0; i < sortedBase.length; i++) {
    if (normaliseId(sortedBase[i].S_ID) !== normaliseId(sortedOther[i].S_ID)) {
      return {
        aligned: false,
        reason: `${label}: S_ID mismatch at position ${i + 1}`,
      };
    }
  }

  return { aligned: true, reason: "" };
}

// ─── controller ─────────────────────────────────────────────────────────────

const uploadFiles = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const referenceFile = req.files?.reference?.[0];
    const englishFile = req.files?.english?.[0];
    const translationFiles = req.files?.translations || [];

    if (!referenceFile || !englishFile || translationFiles.length === 0) {
      return res.status(400).json({
        message: "Reference, English and at least one translation file required",
      });
    }

    const batchId = uuidv4();

    // ── Parse ──────────────────────────────────────────────────────────────
    const referenceSentences = await parseFile(referenceFile.path);
    if (!referenceSentences.length)
      throw new Error("Reference file contains no sentences");

    const englishSentences = await parseFile(englishFile.path);
    if (!englishSentences.length)
      throw new Error("English file contains no sentences");

    // ── MATCH COMMON S_IDs (OPTION 3) ──────────────────────────────────────
    const refMap = new Map(
      referenceSentences.map((s) => [normaliseId(s.S_ID), s])
    );

    const engMap = new Map(
      englishSentences.map((s) => [normaliseId(s.S_ID), s])
    );

    const commonIds = [...refMap.keys()].filter((id) => engMap.has(id));

    if (commonIds.length === 0) {
      throw new Error("No common S_IDs found between Reference and English");
    }

    if (commonIds.length < referenceSentences.length || commonIds.length < englishSentences.length) {
      console.warn(
        `⚠️  Skipping unmatched sentences: Reference=${referenceSentences.length}, English=${englishSentences.length}, Used=${commonIds.length}`
      );
    }

    const filteredRef = commonIds.map((id) => refMap.get(id));
    const filteredEng = commonIds.map((id) => engMap.get(id));

    const sortedRef = sortBySID(filteredRef);
    const sortedEng = sortBySID(filteredEng);

    // ── Insert Reference ──────────────────────────────────────────────────
    const referenceDocs = sortedRef.map((s) => ({
      batchId,
      S_ID: s.S_ID,
      ReferenceSentence: s.text,
    }));

    await Reference.insertMany(referenceDocs, { session });

    // ── Insert English ────────────────────────────────────────────────────
    const sentenceDocs = sortedEng.map((s) => ({
      batchId,
      S_ID: s.S_ID,
      SourceSentence: s.text,
    }));

    await Sentence.insertMany(sentenceDocs, { session });

    // ── Process translations ──────────────────────────────────────────────
    let translatorCounter = 0;

    for (const file of translationFiles) {
      const translatedSentences = await parseFile(file.path);

      // Match only common S_IDs with English
      const transMap = new Map(
        translatedSentences.map((s) => [normaliseId(s.S_ID), s])
      );

      const validIds = commonIds.filter((id) => transMap.has(id));

      if (validIds.length === 0) {
        console.warn(`⚠️  Skipping "${file.originalname}" — no matching S_IDs`);
        continue;
      }

      translatorCounter++;
      const T_ID = `T${translatorCounter}`;

      await Translator.create(
        [{ T_ID, TName: file.originalname.replace(/\.[^/.]+$/, "") }],
        { session }
      );

      const sortedTrans = sortBySID(validIds.map((id) => transMap.get(id)));

      const translationDocs = sortedTrans.map((s) => ({
        batchId,
        S_ID: s.S_ID,
        T_ID,
        SuperId: "SUP001",
        Indian_Translation: s.text,
      }));

      await Translation.insertMany(translationDocs, { session });
    }

    if (translatorCounter === 0) {
      throw new Error(
        "No translation files could be processed — all were misaligned"
      );
    }

    await session.commitTransaction();
    session.endSession();

    // ── Auto evaluation ───────────────────────────────────────────────────
    setImmediate(() => {
      runAutoEvaluation(batchId)
        .then(() => console.log("✅ Auto evaluation completed"))
        .catch((err) => console.error("❌ Auto evaluation failed:", err));
    });

    // ── Cleanup ───────────────────────────────────────────────────────────
    try {
      fs.unlinkSync(referenceFile.path);
      fs.unlinkSync(englishFile.path);
      translationFiles.forEach((f) => fs.unlinkSync(f.path));
    } catch (err) {
      console.warn("⚠️  File cleanup warning:", err.message);
    }

    res.json({
      message: "Upload parsed successfully",
      batchId,
      matchedSentences: commonIds.length,
      translatorsProcessed: translatorCounter,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("❌ Upload error:", error);

    res.status(500).json({
      message: "Upload failed. Transaction rolled back.",
      error: error.message,
    });
  }
};

module.exports = { uploadFiles };