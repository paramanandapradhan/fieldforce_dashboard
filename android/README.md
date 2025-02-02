 # Android Application
 
 ### Update the applicationId in app/build.gradle

Update the android application is in build gradle e.g `applicationId "com.crawlink.leadbook"`


### Update application Links or web urls in build.gradle

Update Application URL in both debug/release build type sections
` buildConfigField "String", "APP_URL", "\"https://dev-leadbook.cloudparker.com\""`

### Update strings.xml

Update App name in strings.xml

### Update application Icon

Generate app Icon using `https://appicons.ai/app/history`

Convert your app icon to android png icon using `https://easyappicon.com/`
Extract the .zip file and paste all folder data into the res folder.

### Run the Application

Now you are redy to run the application in emulator or real device.

### Make release build

Make the app release build, the application sign key is present in the app and signing password already configured in the gradle file.

### Relase App

Now you are ready to release the application.

