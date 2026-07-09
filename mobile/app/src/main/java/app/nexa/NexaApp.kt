package app.nexa

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import app.nexa.service.CallForegroundService
import dagger.hilt.android.HiltAndroidApp
import java.io.File
import java.io.PrintWriter

@HiltAndroidApp
class NexaApp : Application() {
    override fun onCreate() {
        super.onCreate()
        installCrashLogger()
        createNotificationChannels()
    }

    /**
     * Last-resort safety net: if any thread dies with an uncaught exception, write
     * the full stack trace to <app files>/last-crash.txt before the process exits,
     * then let the system handle it normally. Lets us recover the exact cause of a
     * field crash even without a USB/logcat connection.
     */
    private fun installCrashLogger() {
        val previous = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { thread, throwable ->
            runCatching {
                val dir = getExternalFilesDir(null) ?: filesDir
                PrintWriter(File(dir, "last-crash.txt")).use { w ->
                    w.println("thread: ${thread.name}")
                    throwable.printStackTrace(w)
                }
            }
            previous?.uncaughtException(thread, throwable)
        }
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val nm = getSystemService(NotificationManager::class.java)
        nm.createNotificationChannel(
            NotificationChannel(
                CallForegroundService.CHANNEL_ONGOING,
                getString(R.string.call_channel_name),
                NotificationManager.IMPORTANCE_LOW,
            ).apply { description = getString(R.string.call_channel_desc) },
        )
        nm.createNotificationChannel(
            NotificationChannel(
                CallForegroundService.CHANNEL_INCOMING,
                getString(R.string.incoming_call_channel_name),
                NotificationManager.IMPORTANCE_HIGH,
            ).apply {
                // We play our own user-selectable ringtone (RingtonePlayer), so mute
                // the channel's default sound/vibration to avoid double-ringing.
                setSound(null, null)
                enableVibration(false)
            },
        )
    }
}
