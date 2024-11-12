# FoodScanner

FoodScanner is a Node.js application that analyzes food images and reports to determine the presence of seed oils in food. It uses OpenAI's GPT-4 Vision API to process images and provide detailed analysis.

## Prerequisites

- Node.js (v22.11.0 or later)
- npm
- OpenAI API key

## Installation

1. Clone the repository:
'''bash
git clone https://github.com/pintchom/FoodScanner.git
cd FoodScanner
'''

3. Install dependencies:
'''bash
npm install
'''

3. Set up environment variables:
Create a `.env` file in the root directory and add your OpenAI API key:

OPENAI=your_openai_api_key_here
PORT=3000 # Optional, defaults to 3000

## Usage

1. Start the server:

node server.js

2. The server will be running at `http://localhost:3000`

### API Endpoints

#### POST /scan
Analyzes an image and report for the presence of seed oils.

**Request Body:**

{
"IMAGE_URL": "https://your-image-url.com/image.jpg",
"OIL_REPORT": "Description or report about the food",
"ID": "UNIQUE_IDENTIFIER"
}

**Response:**

{
"success": true,
"report": "Original report text",
"analysis": "AI analysis of the image and report",
"decision": true/false,
"csvOutput": "CSV formatted string of the results"
}


### CSV Output

The application automatically saves results to `csv_data/results.csv` with the following format:
- ID: Unique identifier for the scan
- DECISION: Boolean indicating presence of seed oils
- RATIONALE: Detailed explanation from the AI

## Error Handling

- The application includes error handling for missing image URLs and API failures
- Errors are returned with appropriate HTTP status codes and error messages

## Dependencies

- express: Web server framework
- axios: HTTP client
- openai: OpenAI API client
- multer: File upload handling
- sharp: Image processing

## License

ISC

## Author

Max Pintchouk
