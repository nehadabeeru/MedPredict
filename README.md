# MedPredict : Hospital Readmission Prediction System

## Overview
The Hospital Readmission Prediction System is a cutting-edge project developed to leverage advanced Large Language Models (LLMs) such as ClinicalBERT, PubMedBERT, Clinical BigBird, GPT-4 Turbo, and Clinical XLNet. Created as part of the DATA 298B Capstone Project at San Jose State University, this innovative system provides healthcare professionals with actionable insights to improve patient care and manage resources efficiently.

## Objective
The primary goal of this project is to reduce hospital readmissions by building a scalable, accurate, and real-time prediction system using the MIMIC-III dataset. This enables healthcare providers to identify high-risk patients, personalize care plans, and optimize hospital resources.

## Dataset
The project utilizes the publicly available MIMIC-III dataset, which includes diverse data such as:
- Patient demographics
- Admission and discharge summaries
- Medical history and diagnoses
- Clinical notes and laboratory results

## Key Features
- **Advanced Predictive Models**: Utilizes models like ClinicalBERT, PubMedBERT, Clinical BigBird, GPT-4 Turbo, and Clinical XLNet.
- **Performance Metrics**: Achieves an accuracy of over 92%, with precision, recall, and F1-Score all above industry standards.
- **Secure & Scalable Architecture**: The system is built using Python, FastAPI, and React, with cloud storage on AWS S3 ensuring HIPAA compliance. Containerization is handled using Docker to ensure easy deployment and scalability.

## Tech Stack
- **Backend**: Python, FastAPI
- **Frontend**: React, utilizing PubMedBERT for intelligent, context-aware user interactions.
- **Cloud**: AWS (S3, EC2)
- **Libraries**: PyTorch, Hugging Face Transformers, Med7
- **Data Analysis Tools**: Pandas, NumPy, Scikit-learn
- **Containerization**: Docker

## How It Works
### Data Preprocessing:
- Cleaned, tokenized, and normalized patient data.
- Feature engineering to identify key predictors of readmission.
- Enhanced summaries using the GPT-4 API to improve dataset quality and model accuracy.

### Model Training:
- Multiple LLMs trained on structured and unstructured data.
- Models fine-tuned for maximum predictive accuracy.

### Evaluation:
- Model performance assessed using metrics like accuracy, precision, recall, and F1-score.

### Deployment:
- Real-time prediction system integrated with a React-based user interface. Deployment streamlined through Docker.

## Outcomes
- **Proactive Healthcare**: Early identification of high-risk patients.
- **Optimized Resources**: Effective allocation of hospital resources.
- **Enhanced Patient Care**: Reduced readmission rates and improved health outcomes.

## Installation
To install MedPredict, follow these steps:
1. Clone the repository: `git clone https://github.com/nehadabeeru/MedPredict.git`
2. Navigate to the project directory: `cd MedPredict`
3. Install dependencies: `pip install -r requirements.txt`
4. Start the application: `python app.py`

## Usage
1. Upload patient data via the frontend interface.
2. The system preprocesses the data and makes predictions in real-time.
3. Visualize results, including readmission probabilities and key risk factors.

## Contributing
Contributions to enhance the system's features and capabilities are welcome. To contribute:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes and create a pull request.

## Acknowledgments
- **Created by**: Neha Dabeeru
- **Team Members**: Jaya Lakshmi Gunji, Naveen Yadav Gongati, Priyanka Akula, Somna Sattoor
- **Mentor**: Simon Shim
- **Dataset**: MIMIC-III Database

## Connect with Us
Have questions or suggestions? Reach out to us:
- Neha Dabeeru - [LinkedIn](https://www.linkedin.com/in/nehadabeeru/) / [Email](mailto:nehadabeeru04@gmail.com)

## Conclusion
Thank you for your interest in MedPredict. This system represents a significant advancement in utilizing NLP for medical predictive analytics, aiming to reduce hospital readmissions and enhance patient care outcomes.
