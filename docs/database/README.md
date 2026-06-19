# Skema Basis Data — Verand Store

Sumber kebenaran: migrasi di `backend/database/migrations/`. Ringkasan tabel:

## users
| Kolom | Tipe | Catatan |
|-------|------|---------|
| id | bigint PK | |
| name, email | string | email unik |
| password | string | hashed |
| role | enum | customer / booster / admin |
| phone, avatar | string nullable | |
| balance | decimal(14,2) | saldo |
| is_active | boolean | |

## products
| Kolom | Tipe | Catatan |
|-------|------|---------|
| game | string | mobile-legends / genshin-impact / honkai-star-rail |
| type | enum | topup / joki |
| category | string | currency, rank-boost, combo, dst. |
| name, slug | string | slug unik |
| price | decimal(14,2) | |
| unit, quantity | | satuan & jumlah |
| meta | json | difficulty, is_combo, duration, includes[] |

## orders
| Kolom | Tipe | Catatan |
|-------|------|---------|
| order_number | string unik | |
| user_id | FK users | |
| type | enum | topup / joki |
| total_amount | decimal | |
| status | enum | pending → waiting_for_account → processing → completed → finished / cancelled |
| payment_status | enum | unpaid / paid / failed / refunded |

## order_items
order_id FK · product_id FK nullable · name · price · quantity · options(json)

## payments
order_id FK · gateway · reference · method · amount · status · snap_token · redirect_url · payload(json) · paid_at

## joki_orders
order_id FK · booster_id FK users nullable · game · service · game_uid · game_server ·
account_login/password (terenkripsi) · targets(json) · progress(0-100) · eta

## progress_logs
joki_order_id FK · author_id FK · percent · activity · screenshot

## chats
order_id FK · sender_id FK · message · is_bot · read_at

## app_notifications
user_id FK · title · body · type · data(json) · read_at

Lihat `docs/erd/` untuk diagram relasi.
