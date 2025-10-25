from app import create_app

# Create the app instance using the factory
app = create_app()

if __name__ == '__main__':
    print("Starting Flask server... http://127.0.0.1:5000")
    
    # Run the app
    # debug=False and use_reloader=False are important for stability
    # when using background threads.
    app.run(host='0.0.0.0', port=5001, debug=False, threaded=True, use_reloader=False)
