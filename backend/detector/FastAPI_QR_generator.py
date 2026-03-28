from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import qrcode
import uuid
import io

app = FastAPI()

# Base URL of your website (must be absolute)
BASE_URL = "webpage URL - to be replaced"

@app.get("/generate-qr")
async def generate_qr():
    # Generate a unique ID for this QR
    unique_id = str(uuid.uuid4())

    # Create the unique redirect URL
    redirect_url = f"{BASE_URL}?id={unique_id}"

    # Create QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(redirect_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    # Convert image to bytes
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)

    return StreamingResponse(buf, media_type="image/png")
