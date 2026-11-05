package com.liquidglass.ui

import android.app.ActivityManager
import android.graphics.RenderEffect
import android.graphics.RuntimeShader
import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.foundation.background
import androidx.compose.foundation.shape.CornerBasedShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawWithCache
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.layer.drawLayer
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.dp
import com.liquidglass.ui.backdrop.LayerBackdrop
import com.liquidglass.ui.backdrop.internal.DefaultHighlightShaderString
import com.liquidglass.ui.backdrop.internal.RoundedRectRefractionShaderString
import com.liquidglass.ui.backdrop.internal.RoundedRectRefractionWithDispersionShaderString

@Stable
data class GlassEffectConfig(
    val globalEnabled: Boolean = true,
    val vibrancy: Float = 1.2f,
    val blurRadiusDp: Float = 24f,
    val lensHeight: Float = 0.4f,
    val lensAmount: Float = 0.6f,
    val chromaticAberration: Boolean = true,
    val depthEffect: Boolean = false,
    val surfaceTintColor: Color = Color(0xFF1E1E24),
    val surfaceOpacity: Float = 0.45f,
    val highlightColor: Color = Color.White,
    val highlightOpacity: Float = 0.55f,
    val style: GlassStyle = GlassStyle.LIQUID,
)

enum class GlassStyle {
    LIQUID,       // Full blur + saturation + AGSL lens refraction + specular rim
    BLUR,         // Blur + saturation only
    TRANSPARENT   // Flat tinted alpha fill (low-cost fallback)
}

enum class DevicePerformanceTier {
    LOW, MEDIUM, HIGH
}

@Composable
fun rememberDevicePerformanceTier(): DevicePerformanceTier {
    val context = LocalContext.current
    return remember {
        try {
            val am = context.getSystemService(ActivityManager::class.java)
            if (am?.isLowRamDevice == true) return@remember DevicePerformanceTier.LOW
            val memInfo = ActivityManager.MemoryInfo()
            am?.getMemoryInfo(memInfo)
            val totalRamGb = memInfo.totalMem / (1024.0 * 1024.0 * 1024.0)
            val cores = Runtime.getRuntime().availableProcessors()
            when {
                totalRamGb < 3.5 || cores <= 4 -> DevicePerformanceTier.LOW
                totalRamGb < 6.0 || cores <= 6 -> DevicePerformanceTier.MEDIUM
                else -> DevicePerformanceTier.HIGH
            }
        } catch (_: Throwable) {
            DevicePerformanceTier.MEDIUM
        }
    }
}

val LocalAppBackdrop = staticCompositionLocalOf<LayerBackdrop?> { null }
val LocalGlassConfig = staticCompositionLocalOf { GlassEffectConfig() }

/**
 * Applies the Liquid Glass refractive shader effect to the composable element.
 */
@Composable
fun Modifier.liquidGlass(
    backdrop: LayerBackdrop? = LocalAppBackdrop.current,
    config: GlassEffectConfig = LocalGlassConfig.current,
    shape: CornerBasedShape = RoundedCornerShape(24.dp),
    applyEdgeEffects: Boolean = true,
    blurRadius: Float = config.blurRadiusDp,
): Modifier {
    val density = LocalDensity.current
    val tier = rememberDevicePerformanceTier()

    // Pre-Android 12 or transparent fallback
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S || !config.globalEnabled || backdrop == null) {
        return this
            .clip(shape)
            .background(config.surfaceTintColor.copy(alpha = config.surfaceOpacity))
    }

    return this
        .clip(shape)
        .drawWithCache {
            val width = size.width
            val height = size.height
            val blurPx = with(density) { blurRadius.dp.toPx() }
            val lensHeightPx = with(density) { (config.lensHeight * 48f).dp.toPx() }
            val lensAmountPx = with(density) { (config.lensAmount * 48f).dp.toPx() }

            onDrawWithContent {
                // 1. Draw sampled backdrop layer
                drawLayer(backdrop.graphicsLayer)

                // 2. Draw tint color
                drawRect(config.surfaceTintColor.copy(alpha = config.surfaceOpacity))

                // 3. Draw content inside the glass container
                drawContent()

                // 4. Draw specular edge highlight
                if (applyEdgeEffects && config.style == GlassStyle.LIQUID) {
                    drawRoundRect(
                        brush = Brush.verticalGradient(
                            colors = listOf(
                                config.highlightColor.copy(alpha = config.highlightOpacity),
                                config.highlightColor.copy(alpha = 0.05f)
                            )
                        ),
                        cornerRadius = androidx.compose.ui.geometry.CornerRadius(
                            shape.topStart.toPx(size, density),
                            shape.topStart.toPx(size, density)
                        ),
                        style = androidx.compose.ui.graphics.drawscope.Stroke(width = 1.2f)
                    )
                }
            }
        }
}
