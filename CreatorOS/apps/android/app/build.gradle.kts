plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.creatoros"
    compileSdk = 35
    defaultConfig {
        applicationId = "com.creatoros"
        minSdk = 28
        targetSdk = 35
    }
    buildFeatures { compose = true }
}

// Dependencies: Room + sqlcipher-android + FTS5, WorkManager, RevenueCat SDK, Sentry SDK.
// Derived from: docs/architecture/ARCHITECTURE-11-technology-stack-v2.md; apps/android/README.md
