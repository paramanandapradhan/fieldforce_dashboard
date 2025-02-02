package com.crawlink.app;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.MobileAds;


public class MainActivity extends AppCompatActivity {
    private WebView mWebView;
    private AdView mAdView;

    // "https://cashflow.cloudparker.com";
    private String APP_URL = BuildConfig.APP_URL;
    private String TAG = "MainActivity";

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.i(TAG, "Calling onCreate");

        setContentView(R.layout.activity_main);
        mWebView = findViewById(R.id.webview);
        mAdView = findViewById(R.id.adView);

        // Initialize the MobileAds SDK
        MobileAds.initialize(this, initializationStatus -> {
        });

        // Enable JavaScript in the WebView
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);

        webSettings.setAllowContentAccess(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setDomStorageEnabled(true);

        if (BuildConfig.DEBUG) {
            WebView.setWebContentsDebuggingEnabled(true);
        }


        // Set a WebViewClient to handle page navigation
        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                // Implement any custom logic for intercepting requests if necessary
                return super.shouldInterceptRequest(view, request);
            }
        });

        // Set a WebChromeClient to enable debugging if needed
        mWebView.setWebChromeClient(new WebChromeClient());

        // Set a WebChromeClient to enable debugging if needed
        mWebView.setWebChromeClient(new WebChromeClient());

        // Load an ad in the AdView
        AdRequest adRequest = new AdRequest.Builder().build();
        mAdView.loadAd(adRequest);

        mWebView.loadUrl(APP_URL);

        OnBackPressedCallback callback = new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (mWebView.canGoBack()) {
                    mWebView.goBack();
                } else {
                    setEnabled(false); // Disable the callback to avoid infinite loop
//                    onBackPressed(); // Call default system behavior
                }
            }
        };

        getOnBackPressedDispatcher().addCallback(this, callback);
    }

    @Override
    protected void onResume() {
        super.onResume();
    }

    @Override
    protected void onStop() {
        super.onStop();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    @Override
    protected void onSaveInstanceState(@NonNull Bundle outState) {
        super.onSaveInstanceState(outState);
        mWebView.saveState(outState); // Save WebView state
    }

    @Override
    protected void onRestoreInstanceState(@NonNull Bundle savedInstanceState) {
        super.onRestoreInstanceState(savedInstanceState);
        mWebView.restoreState(savedInstanceState); // Restore WebView state
    }

}
