package app.nexa.service

import android.app.Activity
import android.app.Application
import android.os.Bundle

/**
 * Tracks whether any activity is currently visible, so the messaging service
 * only posts a notification for messages that arrive while the app is in the
 * background (no point notifying about a chat the user is already looking at).
 */
object AppForeground : Application.ActivityLifecycleCallbacks {
    @Volatile private var startedActivities = 0
    val isForeground: Boolean get() = startedActivities > 0

    override fun onActivityStarted(activity: Activity) { startedActivities++ }
    override fun onActivityStopped(activity: Activity) { if (startedActivities > 0) startedActivities-- }

    override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {}
    override fun onActivityResumed(activity: Activity) {}
    override fun onActivityPaused(activity: Activity) {}
    override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) {}
    override fun onActivityDestroyed(activity: Activity) {}
}
