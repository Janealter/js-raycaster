export default function init () {
  const mapCanvas = document.getElementById('map-canvas');
  const raysCanvas = document.getElementById('rays-canvas');
  const viewCanvas = document.getElementById('3d-view-canvas');

  if (
    (!mapCanvas || !raysCanvas || !viewCanvas) ||
    (
      !(mapCanvas instanceof HTMLCanvasElement) ||
      !(raysCanvas instanceof HTMLCanvasElement) ||
      !(viewCanvas instanceof HTMLCanvasElement)
    )
  ) {
    throw new Error('Canvas element not found');
  }

  const mapContext = mapCanvas.getContext('2d');
  const raysContext = raysCanvas.getContext('2d');
  const viewContext = viewCanvas.getContext('2d');

  if (!mapContext || !raysContext || !viewContext) throw new Error('Canvas context is not available');

  return { mapContext, raysContext, viewContext };
}
