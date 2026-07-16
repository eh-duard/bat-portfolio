# Crediti asset & licenze

Nessun logo ufficiale o personaggio DC Comics / Warner Bros. e' riprodotto. L'estetica
e' "gothic noir / bat", non il marchio registrato Batman.

## Icone — Iconify via `astro-icon` (self-hosted al build)

| Set | Uso | Licenza |
|-----|-----|---------|
| `lucide` (`@iconify-json/lucide`) | UI dell'OS: dock, finestre, top bar, app | ISC |
| `mdi` (`@iconify-json/mdi`) | Pipistrello del gioco e favicon | Apache-2.0 |
| `logos` (`@iconify-json/logos`) | Loghi tecnologici (uso futuro nelle app di profilo) | vari (marchi dei rispettivi proprietari, uso nominativo) |

Le icone sono incluse al build: nessuna richiesta a CDN esterni a runtime.
`public/favicon.svg` e' generato dall'icona `mdi:bat` (non disegnato a mano).

## Font — self-hosted via Fontsource

| Famiglia | Uso | Licenza |
|----------|-----|---------|
| Space Grotesk | UI, titoli, label | SIL Open Font License 1.1 |
| JetBrains Mono | Terminale, timestamp, metadati | SIL Open Font License 1.1 |

## Wallpaper

| File | Fonte | Licenza | Note |
|------|-------|---------|------|
| `public/wallpaper.jpg` | Unsplash (foto di un pipistrello al crepuscolo) | Unsplash License (uso gratuito, anche commerciale, senza attribuzione) | E' un **pipistrello reale**, non l'emblema DC. |

> **Slot personalizzabile:** per cambiare sfondo basta sostituire `public/wallpaper.jpg`
> con qualsiasi immagine (stesso nome). Le alternative a gradiente sono in Impostazioni.
> Nota: non inserire nel repo pubblico immagini coperte da copyright (fotogrammi di film,
> Lego Batman, tavole a fumetti) se il repo e' pubblicato: sarebbe redistribuzione di IP altrui.

## Foto personali

| File | Note |
|------|------|
| `public/images/propic.png` | Foto dell'autore. In attesa delle app di profilo (dal CV LinkedIn). |
| `public/images/avatar.png` | Foto dell'autore. Come sopra. |

## Rimossi

| File | Motivo |
|------|--------|
| `public/images/bat-logo.svg` | Riproduceva l'emblema DC. |
| icone/wallpaper SVG fatti a mano | Sostituiti da icone di libreria e foto reale. |
| audio `public/sounds/*` | Non usati dalla nuova UI e a licenza non verificata. |
