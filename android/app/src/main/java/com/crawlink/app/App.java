package com.crawlink.app;

import android.app.Application;
import android.content.Context;
import android.util.Log;

public class App extends Application {
    private static final String TAG = "App";

    public static final String AD_APP_ID = "ca-app-pub-4329355148562870~7526445852";
    public static final String AD_BANNER_ID = "ca-app-pub-4329355148562870/2931941717";
    public static final String AD_INTERSTITIAL_ID = "ca-app-pub-4329355148562870/1923888479";
    public static final String AD_VIDEO_ID = "ca-app-pub-4329355148562870/4358480122";

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public void onTerminate() {
        super.onTerminate();
    }

}