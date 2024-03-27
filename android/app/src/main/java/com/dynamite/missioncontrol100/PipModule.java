package com.dynamite.missioncontrol100;

import android.app.PendingIntent;
import android.app.PictureInPictureParams;
import android.app.RemoteAction;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.drawable.Icon;
import android.os.Build;
import android.util.DisplayMetrics;
import android.util.Rational;

import androidx.annotation.RequiresApi;

import com.brentvatne.exoplayer.MyReceiver;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


@RequiresApi(api = Build.VERSION_CODES.O)
public class PipModule extends ReactContextBaseJavaModule{
    PictureInPictureParams.Builder pipBuilder = new PictureInPictureParams.Builder();

    public PipModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }


    @Override
    public String getName() {
        return "PipModule";
    }


    public List<RemoteAction> makeControls(Boolean isPlaying){
        List<RemoteAction> action = new ArrayList<>();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

            Intent seekbackwardIntent = new Intent(getReactApplicationContext(), MyReceiver.class);
            seekbackwardIntent.putExtra("action", "backward");
            PendingIntent backwardIntent = PendingIntent.getBroadcast(getReactApplicationContext(),
                    2, seekbackwardIntent, PendingIntent.FLAG_IMMUTABLE);


            Intent playIntent = new Intent(getReactApplicationContext(), MyReceiver.class);
            playIntent.putExtra("action", "play");
            PendingIntent playPendingIntent = PendingIntent.getBroadcast(getReactApplicationContext(),
                    3, playIntent,  PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);



            Intent seekForwardIntent = new Intent(getReactApplicationContext(), MyReceiver.class);
            seekForwardIntent.putExtra("action", "forward");
            PendingIntent forwardPendindIntent = PendingIntent.getBroadcast(getReactApplicationContext(),
                    4, seekForwardIntent, PendingIntent.FLAG_IMMUTABLE);


            RemoteAction seekForwardAction = new RemoteAction(
                    Icon.createWithResource("com.dynamite.digital", R.drawable.forward5),
                    "Seek forward",
                    "SEEK_FORWARD",
                    forwardPendindIntent);


            RemoteAction seekBackwardAction = new RemoteAction(
                    Icon.createWithResource("com.dynamite.digital", R.drawable.backward5),
                    "Seek backward",
                    "SEEK_BACKWARD",
                    backwardIntent);
            RemoteAction playAction;




                playAction = new RemoteAction(
                        Icon.createWithResource(getReactApplicationContext(),R.drawable.playpause),
                        "play",
                        "PLAY",
                        playPendingIntent);



            action.add(0, seekBackwardAction);
            action.add(1, playAction);
            action.add(2, seekForwardAction);

        }
        return action;
    }

    @ReactMethod
    public void enterPipMode() {
        if (getCurrentActivity() != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

                Rational  aspectRatio =new Rational(16, 9);
                PictureInPictureParams.Builder   pipBuilder = new PictureInPictureParams
                        .Builder();
                pipBuilder.setActions(makeControls(true));
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
//                    pipBuilder.setAutoEnterEnabled(true);
                    pipBuilder.setSeamlessResizeEnabled(true);
                }

                PictureInPictureParams params = pipBuilder.build();
                getCurrentActivity().enterPictureInPictureMode(params);
            }
        }
    }


    @ReactMethod
    public void exitPipMode() {
        if (getCurrentActivity() != null) {
        }
    }


    @ReactMethod
    public void setAspectRatio(float heightFactor) {
        if (getCurrentActivity() != null && getCurrentActivity().isInPictureInPictureMode()) {
            DisplayMetrics displayMetrics = new DisplayMetrics();
            getCurrentActivity().getWindowManager().getDefaultDisplay().getMetrics(displayMetrics);
            int screenWidth = displayMetrics.widthPixels;
            int screenHeight = displayMetrics.heightPixels;

            float aspectRatio = 32f / 16f;

            int pipWidth;
            int pipHeight;
            if (screenWidth > screenHeight) {
                pipWidth = screenHeight;
                pipHeight = (int) (screenHeight / aspectRatio);
            } else {
                pipWidth = screenWidth;
                pipHeight = (int) (screenWidth / aspectRatio);
            }

            // Increase the height by the specified factor
            pipHeight = (int) (pipHeight * heightFactor);
            List<RemoteAction> emptyActions = Collections.emptyList();

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

                pipBuilder.setActions(emptyActions);

            // Check if the setAspectRatio method is available (added in API level 31)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                Rational aspectRatioRational = new Rational(pipWidth, pipHeight);
                pipBuilder.setAspectRatio(aspectRatioRational);
            } else {
                // Handle earlier Android versions
            }

            PictureInPictureParams params = pipBuilder.build();
            getCurrentActivity().setPictureInPictureParams(params);
            }
        }
    }



    @ReactMethod
    public boolean isInPipMode() {
        return getCurrentActivity() != null && getCurrentActivity().isInPictureInPictureMode();
    }

    @ReactMethod
    public void onPlayBackStateChanged(Boolean isPlaying) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            pipBuilder.setActions(makeControls(isPlaying));
            getCurrentActivity().setPictureInPictureParams(pipBuilder.build());
        }

    }

    public  void changeControls(Boolean isPlaying) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            pipBuilder.setActions(makeControls(isPlaying));
            getCurrentActivity().setPictureInPictureParams(pipBuilder.build());

        }
        // Handle configuration changes if necessary
    }






    public void onConfigurationChanged(Configuration newConfig) {

        // Handle configuration changes if necessary
    }



}
