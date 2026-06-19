# AI — Webhook

Penerima event untuk konteks AI (mis. update status order agar chatbot bisa
menjawab status terbaru berdasarkan webhook).

Sumber event: topik Kafka `progress-update` & `payment-success`, atau callback
Midtrans. Dalam mode bawaan, `ChatbotService` membaca langsung dari database
sehingga webhook ini opsional. Untuk arsitektur microservice, daftarkan
endpoint di sini dan set `AI_MODE=remote` + `AI_SERVICE_URL` di backend.
