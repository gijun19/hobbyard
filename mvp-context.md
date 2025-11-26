# Hobbyard MVP Context

This document provides a high-level overview of Hobbyard and the core
features required to deliver a working MVP.

## What Is Hobbyard

Hobbyard is a low-end trading card marketplace focused on fast intake,
simple selling, and efficient shipping. The goal is to offer a
lightweight alternative to platforms like COMC with an emphasis on
$1–$10 cards and batch shipping through Buyer Boxes.

## Core Concepts

### Intake Batches

Sellers send cards to Hobbyard in batches. Each shipment is tracked as
an IntakeBatch and moves through the following states:

- pending
- received
- processing
- completed

Each batch contains many cards that are scanned, photographed, priced,
and stored.

### Marketplace Listings

Cards are displayed to buyers with simple filters:

- player name
- set name
- parallel
- price range

Only active cards are visible. Reserved or sold cards are hidden.

### Buyer Box

Each buyer has a Buyer Box. When a buyer adds a card to their box:

- The card is reserved and hidden from the marketplace.
- It stays in the box until the buyer requests shipping.

This allows buyers to accumulate many low-value cards before shipping.

### Orders

When a buyer ships their box, an Order is created:

- All reserved cards become sold.
- OrderItems list the specific cards in the shipment.
- The Buyer Box is cleared.

The order serves as a packing list for pulling cards from the vault.

### Vault Storage

Cards are stored physically in bins or trays with a slot location such
as:
