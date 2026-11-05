package com.liquidglass.ui.backdrop

import androidx.compose.runtime.Composable
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.graphics.drawscope.ContentDrawScope
import androidx.compose.ui.graphics.layer.GraphicsLayer
import androidx.compose.ui.graphics.layer.drawLayer
import androidx.compose.ui.graphics.rememberGraphicsLayer
import androidx.compose.ui.layout.LayoutCoordinates
import androidx.compose.ui.layout.onGloballyPositioned

/**
 * Captures Compose UI hierarchy into an offscreen RenderNode GraphicsLayer.
 * Multiple glass elements can reference this backdrop, reprojecting and sampling it.
 */
@Composable
fun rememberLayerBackdrop(
    graphicsLayer: GraphicsLayer = rememberGraphicsLayer(),
    onDraw: ContentDrawScope.() -> Unit = { drawContent() }
): LayerBackdrop {
    return remember(graphicsLayer, onDraw) {
        LayerBackdrop(graphicsLayer, onDraw)
    }
}

@Stable
class LayerBackdrop internal constructor(
    val graphicsLayer: GraphicsLayer,
    internal val onDraw: ContentDrawScope.() -> Unit
) {
    internal var layerCoordinates: LayoutCoordinates? by mutableStateOf(null)

    /** Monotonic counter incremented on every content re-record */
    internal var contentVersion: Int = 0
        private set

    internal fun contentRecorded() {
        contentVersion++
    }

    internal val staticRegions = ArrayList<Rect>()

    internal fun isFullyStatic(rect: Rect): Boolean =
        staticRegions.any { region ->
            region.left <= rect.left &&
            region.top <= rect.top &&
            region.right >= rect.right &&
            region.bottom >= rect.bottom
        }
}

/**
 * Modifier applied to the root container whose content should be captured for glass refraction.
 */
fun Modifier.layerBackdrop(backdrop: LayerBackdrop): Modifier = this
    .onGloballyPositioned { coordinates ->
        backdrop.layerCoordinates = coordinates
    }
    .drawWithContent {
        backdrop.graphicsLayer.record {
            this@drawWithContent.drawContent()
        }
        backdrop.contentRecorded()
        drawLayer(backdrop.graphicsLayer)
    }
