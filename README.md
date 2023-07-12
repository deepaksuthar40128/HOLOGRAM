# [MERN Social App](https://socialyuva.vercel.app/)

![image](https://github.com/deepaksuthar40128/reactHost/assets/92250394/2683e55a-6bc2-4201-a021-d160cd3a4c31)

## Description

This is a MERN (MongoDB, Express.js, React.js, Node.js) social app that allows users to connect and share content with each other. It provides features such as public key authentication, AWS S3 integration for image storage, and utilizes MongoDB with connect-mongo-session for session management.

## Features

- **Public Key Authentication**: The app uses public key authentication for secure user authentication.
- **Dynamic Loading**: Only load more posts after viewing of old posts.
- **Compressed Posts**: Automattically compress the images to save load time.
- **AWS S3 Integration**: User images are stored in AWS S3, providing scalable and reliable image storage.
- **MongoDB with connect-mongo-session**: MongoDB is used as the database, and connect-mongo-session is used for session management.

## Installation

To run this app on your local machine, follow these steps:

1. Clone the repository: clone this repo by `git clone https://github.com/deepaksuthar40128/reactHost.git`


2. Navigate to the project directory: Navigate to client folder and for ease copy it out for the folder you clone


3. Install the dependencies for the server and client: RUn `npm i` for both client and server


4. Set up environment variables:

- Create a `.env` file in the `server` directory.
- Add the necessary environment variables, such as database connection details, AWS S3 credentials, email.

5. Start the server: start server and client by `npm start`


6. Open your browser and visit `http://localhost:3000` to see the app in action.

## Contributing

Contributions are welcome! If you have any ideas or improvements, please submit a pull request. For major changes, please open an issue first to discuss the changes.


## You can contact me for any tips/query anytime [Deepak Suthar](https://deepaksuthar.vercel.app)

