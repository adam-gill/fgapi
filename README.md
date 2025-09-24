# fgapi
A helper API for filegilla that generates .webp preview images for files (image, video, and pdf files are currently supported).

### Prerequisites
Before you start, make sure you have these tools installed on your computer:

- [Git](https://git-scm.com "https://git-scm.com")
- [Docker](https://docker.com "https://docker.com")

### Getting Started: Local Development
Follow these steps to run the app on your computer in "development mode," which is perfect for coding and testing because it reloads automatically when you save your files.

#### Step 1: Clone the Repository
First, open your terminal, go to the folder where you keep your projects, and run this command to download the code:

```bash
git clone <your-repository-url>
cd <your-project-folder>
```

#### Step 2: Create Your Environment File
The application needs some secret keys and settings to work. You'll store these in a special file that you never share publicly.

- Create a new file in the project folder named .env

- Copy the text below and paste it into your new .env file.

- Important: Replace the placeholder values (like your_db_password) with your actual settings.

```bash
# .env file template

# Set the environment to 'development'
DENO_ENV=development

# The IP address the server should listen on (use 0.0.0.0 for Docker)
HOST=0.0.0.0

# The main URL of your application
BASE_URL=http://localhost:8080

# Your PostgreSQL database connection string
# Format: postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
DB_URL=postgresql://postgres:your_db_password@db:5432/mydatabase
```

#### Step 3: Run the App!
Now for the easy part! Run this single command in your terminal. It will build your app's container and start it up.

```bash
# might need to preface with sudo
docker compose up
```

Your app is now running! You can see its logs in the terminal. To stop it, just press Ctrl + C.

### Production & Deployment
This section shows you how to build a final, optimized image and run it just like you would on a real server.

#### Step 1: Build the Final Production Image
This command builds your app using the Dockerfile and gives it a name. This image will have your code baked into it and is ready to be deployed. Replace your-username with your Docker Hub username.

```bash
docker build -t your-username/my-app:1.0.0 .
```

#### Step 2: Run the Production Container
To run your app in "production mode," you'll use the special docker-compose.prod.yml file. This is safer and more efficient for a real server.

Make sure you have a .env file ready with your production settings.

```bash
# The -f flag tells it to use the production file
# The -d flag runs it in the background
docker compose -f docker-compose.prod.yml up -d
```

#### Step 3: Pushing Your Image to a Docker Registry
After you've built your final image, you can upload it to a place like Docker Hub so your server can download it.

Log in to Docker Hub:

```bash
docker login
```

Push the image: (Make sure you tagged it with your username in Step 1!)

```bash
docker push your-username/my-app:1.0.0
```

Your image is now online and ready to be pulled by any server you want!
