package com.zoul

import android.content.Context
import android.content.SharedPreferences
import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.modules.i18nmanager.I18nUtil
import java.util.*
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        SplashScreen.show(this, true) // Show splash screen before app loads

        super.onCreate(null)
        
        val sharedI18nUtilInstance = I18nUtil.getInstance()

        // Access shared preferences for language preference
        val sharedPreferences: SharedPreferences = getSharedPreferences("zoul", Context.MODE_PRIVATE)
        val objLANGUAGE = sharedPreferences.getString("LANGUAGE", null)

        Log.d("MainActivity", "Stored language preference: $objLANGUAGE")

        // Get the device's default language
        val deviceLanguage = Locale.getDefault().language
        Log.d("MainActivity", "Device language: $deviceLanguage")

        if (objLANGUAGE != null) {
            // Apply RTL settings based on stored language preference
            applyRTLSettings(sharedI18nUtilInstance, objLANGUAGE)
        } else {
            // Apply RTL settings based on device's default language
            applyRTLSettings(sharedI18nUtilInstance, deviceLanguage)
        }
    }

    private fun applyRTLSettings(sharedI18nUtilInstance: I18nUtil, language: String) {
        if (language == "ar") {
            sharedI18nUtilInstance.allowRTL(this, true)
            sharedI18nUtilInstance.forceRTL(this, true)
            Log.d("MainActivity", "RTL mode enabled for language: $language")
        } else {
            sharedI18nUtilInstance.allowRTL(this, false)
            sharedI18nUtilInstance.forceRTL(this, false)
            Log.d("MainActivity", "RTL mode disabled for language: $language")
        }
    }

    override fun getMainComponentName(): String = "zoul"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
