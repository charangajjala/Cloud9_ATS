import difflib
import boto3
from io import BytesIO
import textract
import json
import tempfile
import os
def compute_similarity(text1, text2):
    return difflib.SequenceMatcher(None, text1, text2).ratio()
    
def lambda_handler(event, context):
    # Extract jobId and jobDescription from the request body
    jobId = event['jobId']
    jobDescription = event['jobDescription']
    aws_access_key_id = 'AKIASOOWVMUI3IEB7AOW'
    aws_secret_access_key = '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'
    aws_region = 'us-east-2'

    print(jobId)

    # Initialize DynamoDB client
    # dynamodb = boto3.resource('dynamodb')
    dynamodb = boto3.resource('dynamodb', region_name=aws_region,
                          aws_access_key_id=aws_access_key_id,
                          aws_secret_access_key=aws_secret_access_key)

    table = dynamodb.Table('applyjobs')  # Replace 'applyjobs' with your DynamoDB table name

    # Query applicants from DynamoDB based on jobId
    response = table.scan(
        FilterExpression=boto3.dynamodb.conditions.Attr('jobId').eq(jobId)
    )
    applicants = response['Items']

    # Initialize S3 client
    # s3 = boto3.client('s3')
    s3 = boto3.client('s3', region_name=aws_region,
                  aws_access_key_id=aws_access_key_id,
                  aws_secret_access_key=aws_secret_access_key)

    top_applicants = []

    # Process each applicant
    for applicant in applicants:
        userId = applicant['userId']
        firstName = applicant['firstName']
        lastName = applicant['lastName']
        personalEmail = applicant['personalEmail']
        resumeId = applicant['resumeId']
        skills = applicant['skills']

        # Fetch resume from S3
        try:
            obj = s3.get_object(Bucket='cloud9ats', Key=f'resumes/{userId}/{jobId}.pdf')
            resume_content = obj['Body'].read()

        # Save resume content to a temporary file
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                temp_file.write(resume_content)
                temp_file_path = temp_file.name

            # Extract text from the temporary file using textract
                # Extract text from the temporary file using textract
            try:
                text = textract.process(temp_file_path).decode('utf-8')
            except Exception as e:
                # If 'utf-8' fails, try another encoding
                # text = textract.process(temp_file_path).decode('latin-1')  # Example: 'latin-1' encoding
                text = skills

            # Delete the temporary file
            os.unlink(temp_file_path)
            
            similarity_score = compute_similarity(jobDescription, text)

            # Store applicant details and similarity score
            top_applicants.append({
                'userId': userId,
                'firstName': firstName,
                'lastName': lastName,
                'personalEmail': personalEmail,
                'similarityScore': similarity_score
            })
        except Exception as e:
            print(f"Error fetching resume for userId {userId}: {str(e)}")
    
    # Sort applicants by similarity score and select top 5
    top_applicants = sorted(top_applicants, key=lambda x: x['similarityScore'], reverse=True)[:5]

    response = {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',  # Adjust this based on your frontend URL
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET'
        },
        'body': json.dumps(top_applicants)
    }

    return response