TATVA (H-Eval) – Human Evaluation Platform for Translation Systems
Translation Assesment with Trustworthy Verdict and Annotation
TATVA (H-Eval) is a human-centric evaluation platform designed to assess the quality of machine translation systems using structured human judgments. The platform enables evaluators to compare translations, provide scores based on evaluation criteria, and generate meaningful insights for translation research.

 Features:
 Secure User Authentication (JWT + bcrypt)
 Upload XML / JSON / TXT translation datasets
 Support for multiple translation systems
 Human evaluation workflow for translations
 Evaluation analytics and score aggregation
 Evaluator profile dashboard
 Batch-wise evaluation history
 Automatic evaluation pipeline support
 Interactive and responsive UI

  Tech Stack:
  
Frontend:
React.js
Tailwind CSS
JavaScript
React Router
Framer Motion

Backend:
Node.js
Express.js

Database:
MongoDB
Mongoose

Authentication & Security:
JWT Authentication
bcrypt.js

File Handling:
Multer
XML / JSON Parsing

 Project Workflow
 
User uploads:
Reference file
English source file
Multiple translation files

Backend validates:
File structure
Sentence alignment
Supported formats

Files are parsed and stored in MongoDB using a unique batchId.
Human evaluators review translations and assign scores based on evaluation criteria.
Evaluation data is aggregated and displayed through analytics dashboards and profile pages.
