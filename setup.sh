#!/bin/bash

echo "🚀 Setting up MicroHabit App..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo "📦 Installing dependencies..."

# Install dependencies
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your Firebase project at https://console.firebase.google.com/"
echo "2. Update firebase/firebaseConfig.js with your Firebase credentials"
echo "3. Run 'npm start' to start the development server"
echo "4. Install Expo Go on your mobile device to test the app"
echo ""
echo "📖 For detailed instructions, see README.md" 