from flask import Flask, request, jsonify
from app import create_app
import os

# Create the Flask app
app = create_app()

# Vercel serverless function handler
def handler(event, context):
    # Handle the request using Flask
    with app.test_request_context(
        path=event['path'],
        method=event['httpMethod'],
        headers=event.get('headers', {}),
        data=event.get('body', ''),
        query_string=event.get('queryStringParameters', {})
    ):
        try:
            response = app.full_dispatch_request()
            return {
                'statusCode': response.status_code,
                'headers': dict(response.headers),
                'body': response.get_data(as_text=True)
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'body': str(e)
            }

# For local testing
if __name__ == '__main__':
    app.run(debug=True)
