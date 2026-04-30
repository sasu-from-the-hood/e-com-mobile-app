#!/bin/bash

set -e

echo "==> Installing prerequisites (wget, unzip)..."
sudo apt update -qq && sudo apt install -y wget unzip

echo "==> Checking Java (JDK 17)..."
if ! java -version 2>&1 | grep -q "17"; then
  echo "Installing OpenJDK 17..."
  sudo apt update && sudo apt install -y openjdk-17-jdk
else
  echo "Java 17 already installed."
fi

export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
echo "JAVA_HOME set to: $JAVA_HOME"

echo "==> Checking Android Studio..."
ANDROID_STUDIO_DIR="$HOME/android-studio"
if [ ! -d "$ANDROID_STUDIO_DIR" ]; then
  echo "Downloading Android Studio..."
  STUDIO_URL="https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2024.1.1.13/android-studio-2024.1.1.13-linux.tar.gz"
  wget -q --show-progress -O /tmp/android-studio.tar.gz "$STUDIO_URL"
  echo "Extracting Android Studio to $HOME..."
  tar -xzf /tmp/android-studio.tar.gz -C "$HOME"
  rm /tmp/android-studio.tar.gz
  echo "Android Studio extracted to $ANDROID_STUDIO_DIR"
else
  echo "Android Studio already present at $ANDROID_STUDIO_DIR"
fi

echo "==> Checking Android SDK (command-line tools)..."
export ANDROID_HOME="$HOME/Android/Sdk"
mkdir -p "$ANDROID_HOME"

if [ ! -d "$ANDROID_HOME/cmdline-tools" ]; then
  echo "Downloading Android command-line tools..."
  CMDTOOLS_URL="https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip"
  wget -q --show-progress -O /tmp/cmdline-tools.zip "$CMDTOOLS_URL"
  mkdir -p "$ANDROID_HOME/cmdline-tools"
  unzip -q /tmp/cmdline-tools.zip -d "$ANDROID_HOME/cmdline-tools"
  mv "$ANDROID_HOME/cmdline-tools/cmdline-tools" "$ANDROID_HOME/cmdline-tools/latest"
  rm /tmp/cmdline-tools.zip
  echo "Command-line tools installed."
fi

export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"

echo "==> Accepting Android SDK licenses..."
yes | sdkmanager --licenses > /dev/null 2>&1 || true

echo "==> Installing Android SDK platform and build tools..."
sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0" "emulator" "ndk;27.1.12297006"

export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools/bin:$PATH"

echo "==> Installing npm dependencies..."
cd frontend-app
npm install

echo "==> Making gradlew executable..."
chmod +x android/gradlew

echo "==> Setting Gradle JVM args in gradle.properties..."
GRADLE_PROPS="android/gradle.properties"
if ! grep -q "org.gradle.jvmargs" "$GRADLE_PROPS"; then
  echo "org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m" >> "$GRADLE_PROPS"
fi

echo "==> Pre-downloading Gradle distribution..."
GRADLE_VERSION="8.14.3"
GRADLE_ZIP="gradle-${GRADLE_VERSION}-bin.zip"
GRADLE_DIST_DIR="$HOME/.gradle/wrapper/dists/gradle-${GRADLE_VERSION}-bin"
mkdir -p "$GRADLE_DIST_DIR"

# Only download if not already cached
if [ -z "$(find "$GRADLE_DIST_DIR" -name "*.zip" 2>/dev/null)" ]; then
  echo "Downloading Gradle $GRADLE_VERSION..."
  wget --retry-connrefused --waitretry=5 --tries=10 --timeout=60 \
    -O "$GRADLE_DIST_DIR/$GRADLE_ZIP" \
    "https://services.gradle.org/distributions/$GRADLE_ZIP"
  echo "Gradle downloaded."
else
  echo "Gradle $GRADLE_VERSION already cached."
fi

echo "==> Running expo run:android..."
npm run android

echo ""
echo "==> To launch Android Studio UI, run:"
echo "    $HOME/android-studio/bin/studio.sh"
