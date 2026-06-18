# Verand-Store - Struktur Folder Project

``` text
verand-store/
│
├── README.md
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── composer.json
│
├── backend/                           # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Auth/
│   │   │   │   ├── User/
│   │   │   │   ├── Product/
│   │   │   │   ├── Order/
│   │   │   │   ├── Payment/
│   │   │   │   ├── Topup/
│   │   │   │   ├── Joki/
│   │   │   │   │   ├── MobileLegends/
│   │   │   │   │   ├── Genshin/
│   │   │   │   │   ├── HonkaiStarRail/
│   │   │   │   │   ├── Booster/
│   │   │   │   │   └── Progress/
│   │   │   │   ├── AI/
│   │   │   │   └── Admin/
│   │   │   ├── Middleware/
│   │   │   └── Requests/
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Product.php
│   │   │   ├── Order.php
│   │   │   ├── Payment.php
│   │   │   ├── Booster.php
│   │   │   ├── JokiOrder.php
│   │   │   ├── ProgressLog.php
│   │   │   ├── Chat.php
│   │   │   └── Notification.php
│   │   ├── Services/
│   │   │   ├── Midtrans/
│   │   │   ├── Kafka/
│   │   │   ├── AI/
│   │   │   ├── Topup/
│   │   │   └── Joki/
│   │   ├── Jobs/
│   │   ├── Events/
│   │   ├── Listeners/
│   │   └── Policies/
│   ├── routes/
│   │   ├── api.php
│   │   └── web.php
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── factories/
│   ├── storage/
│   └── tests/
│
├── frontend/                          # Next.js / React
│   ├── public/
│   └── src/
│       ├── app/
│       ├── components/
│       │   ├── Navbar/
│       │   ├── Footer/
│       │   ├── ProductCard/
│       │   ├── OrderTracker/
│       │   ├── Chat/
│       │   └── Dashboard/
│       ├── pages/
│       │   ├── auth/
│       │   ├── topup/
│       │   ├── joki/
│       │   │   ├── mobile-legends/
│       │   │   ├── genshin-impact/
│       │   │   └── honkai-star-rail/
│       │   ├── checkout/
│       │   ├── profile/
│       │   └── admin/
│       ├── hooks/
│       ├── context/
│       ├── services/
│       ├── utils/
│       └── styles/
│
├── ai-service/
│   ├── chatbot/
│   ├── recommendation/
│   ├── pricing/
│   └── webhook/
│
├── kafka/
│   ├── producer/
│   ├── consumer/
│   └── topics/
│       ├── payment-created
│       ├── payment-success
│       ├── topup-process
│       ├── joki-process
│       ├── progress-update
│       └── notification
│
├── integrations/
│   ├── midtrans/
│   ├── game-voucher/
│   ├── genshin-api/
│   ├── hsr-api/
│   └── notification/
│
├── docs/
│   ├── api/
│   ├── database/
│   ├── architecture/
│   ├── flowchart/
│   ├── erd/
│   ├── sequence-diagram/
│   └── deployment/
│
├── infrastructure/
│   ├── nginx/
│   ├── docker/
│   ├── kubernetes/
│   ├── terraform/
│   └── monitoring/
│
└── scripts/
    ├── backup.sh
    ├── deploy.sh
    └── migrate.sh
```

## Modul Jasa Joki

-   Mobile Legends
    -   Rank Boost
    -   Win Rate
    -   MMR Hero
    -   Placement
    -   Event
-   Genshin Impact
    -   Daily Commission
    -   Resin Farming
    -   Weekly Boss
    -   Story Quest
    -   World Quest
    -   Exploration
    -   Oculus
-   Honkai: Star Rail
    -   Daily Training
    -   Trailblaze Power
    -   Weekly Boss
    -   Story
    -   Exploration
    -   Treasure \`\`\`
