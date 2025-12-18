# Try On Gear - Visual Flow Guide

## 🎯 User Journey Map

```
┌─────────────────────────────────────────────────────────────┐
│                        HOME SCREEN                          │
│                                                             │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐   │
│  │ BGR │  │ IE  │  │ WR  │  │ CI  │  │ AMT │  │ TOG │   │
│  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └──┬──┘   │
│                                                     │       │
└─────────────────────────────────────────────────────┼───────┘
                                                      │
                                                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   TRY ON GEAR SCREEN                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ← Back          TRY-ON GEAR                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         SECTION 1: INTERACTIVE TRY-ON               │   │
│  │                                                     │   │
│  │  Try on glasses, watches, shoes, pants, shirts     │   │
│  │  and more on your model with AI precision.         │   │
│  │                                                     │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │  Select from Available Models                 │ │   │
│  │  │                                               │ │   │
│  │  │  ┌────┐  ┌────┐  ┌────┐  ┌────┐            │ │   │
│  │  │  │ M1 │  │ M2 │  │ M3 │  │ M4 │  ◄─────────┼─┼───┐
│  │  │  └────┘  └────┘  └────┘  └────┘            │ │   │
│  │  │                                               │ │   │
│  │  │  Model 1 of 4                                │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  │                                                     │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │  Select Accessory Type                        │ │   │
│  │  │                                               │ │   │
│  │  │  ┌──────────┐  ┌──────────┐                 │ │   │
│  │  │  │ 👓 Glass │  │ 👟 Shoes │                 │ │   │
│  │  │  │ [Upload] │  │ [Upload] │  ◄──────────────┼─┼───┐
│  │  │  └──────────┘  └──────────┘                 │ │   │
│  │  │  ┌──────────┐  ┌──────────┐                 │ │   │
│  │  │  │ 👖 Pants │  │ 👕 Shirt │                 │ │   │
│  │  │  │ [Upload] │  │ [Upload] │                 │ │   │
│  │  │  └──────────┘  └──────────┘                 │ │   │
│  │  │  ┌──────────┐  ┌──────────┐                 │ │   │
│  │  │  │ 🧥 Jacket│  │ ⌚ Watch │                 │ │   │
│  │  │  │ [Upload] │  │ [Upload] │                 │ │   │
│  │  │  └──────────┘  └──────────┘                 │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  │                                                     │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │      [Try All Accessories]                    │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ═══════════════════════════════════════════════════════   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │      SECTION 2: FOLDER-BASED PROCESSING            │   │
│  │                                                     │   │
│  │  Upload folders with structured images for         │   │
│  │  batch processing.                                  │   │
│  │                                                     │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │  Folder Upload              [View Guide]      │ │   │
│  │  │                                               │ │   │
│  │  │  Select images following required structure   │ │   │
│  │  │                                               │ │   │
│  │  │  ┌─────────────────────────────────────────┐ │ │   │
│  │  │  │  📁  Select Folder Images               │ │ │   │
│  │  │  └─────────────────────────────────────────┘ │ │   │
│  │  │                                               │ │   │
│  │  │  ┌─────────────────────────────────────────┐ │ │   │
│  │  │  │      [Process Folder]                   │ │ │   │
│  │  │  └─────────────────────────────────────────┘ │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  │                                                     │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │  Multi-Folder Upload        [View Guide]      │ │   │
│  │  │                                               │ │   │
│  │  │  Select multiple folders for batch processing │ │   │
│  │  │                                               │ │   │
│  │  │  ┌─────────────────────────────────────────┐ │ │   │
│  │  │  │  📚  Select Multiple Folders            │ │ │   │
│  │  │  └─────────────────────────────────────────┘ │ │   │
│  │  │                                               │ │   │
│  │  │  ┌─────────────────────────────────────────┐ │ │   │
│  │  │  │      [Process Multi-Folder]             │ │ │   │
│  │  │  └─────────────────────────────────────────┘ │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Component Hierarchy

```
TryOnGearScreen
│
├── SafeAreaView
│   │
│   ├── Header
│   │   ├── Back Button (←)
│   │   ├── Title ("TRY-ON GEAR")
│   │   └── Placeholder
│   │
│   ├── ScrollView
│   │   │
│   │   ├── Interactive Section
│   │   │   ├── Section Title
│   │   │   ├── Section Subtitle
│   │   │   │
│   │   │   ├── Model Selection
│   │   │   │   ├── Subsection Title
│   │   │   │   ├── Horizontal ScrollView
│   │   │   │   │   └── Model Cards (4)
│   │   │   │   └── Model Indicator
│   │   │   │
│   │   │   ├── Accessory Grid
│   │   │   │   ├── Subsection Title
│   │   │   │   └── Grid (2 columns)
│   │   │   │       ├── Glasses Card
│   │   │   │       ├── Shoes Card
│   │   │   │       ├── Pants Card
│   │   │   │       ├── Shirt Card
│   │   │   │       ├── Jacket Card
│   │   │   │       └── Watch Card
│   │   │   │
│   │   │   └── Primary Button
│   │   │       └── "Try All Accessories"
│   │   │
│   │   ├── Divider
│   │   │
│   │   ├── Folder Section
│   │   │   ├── Section Title
│   │   │   ├── Section Subtitle
│   │   │   │
│   │   │   ├── Folder Upload
│   │   │   │   ├── Header (Title + Guide Button)
│   │   │   │   ├── Helper Text
│   │   │   │   ├── Folder Button
│   │   │   │   └── Process Button
│   │   │   │
│   │   │   └── Multi-Folder Upload
│   │   │       ├── Header (Title + Guide Button)
│   │   │       ├── Helper Text
│   │   │       ├── Multi-Folder Button
│   │   │       └── Process Button
│   │   │
│   │   └── Status Messages
│   │       ├── Success Message (conditional)
│   │       └── Error Message (conditional)
│   │
│   └── Modals
│       ├── Folder Guide Modal
│       │   ├── Modal Overlay
│       │   └── Modal Content
│       │       ├── Header (Title + Close)
│       │       └── Body (Folder Structure)
│       │
│       └── Multi-Folder Guide Modal
│           ├── Modal Overlay
│           └── Modal Content
│               ├── Header (Title + Close)
│               └── Body (Multi-Folder Structure)
```

---

## 🔄 State Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      REDUX STORE                            │
│                                                             │
│  tryOnGear: {                                               │
│    selectedModel: null,                                     │
│    accessories: {                                           │
│      glasses: null,                                         │
│      shoes: null,                                           │
│      pants: null,                                           │
│      shirt: null,                                           │
│      jacket: null,                                          │
│      watch: null                                            │
│    },                                                       │
│    folderImages: [],                                        │
│    multiFolderImages: [],                                   │
│    mode: 'interactive',                                     │
│    status: 'idle',                                          │
│    errorMessage: null                                       │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
                          ▲
                          │
                          │ dispatch(action)
                          │
┌─────────────────────────┴───────────────────────────────────┐
│                    USER ACTIONS                             │
│                                                             │
│  Interactive Flow:                                          │
│  ├─ Select Model ──────► setSelectedModel(model)           │
│  ├─ Upload Accessory ──► setAccessoryImage({type, image})  │
│  ├─ Remove Accessory ──► removeAccessoryImage(type)        │
│  └─ Process ───────────► processInteractiveTryOn()         │
│                                                             │
│  Folder Flow:                                               │
│  ├─ Select Folder ─────► setFolderImages(images)           │
│  ├─ Select Multi ──────► setMultiFolderImages(folders)     │
│  ├─ Process Folder ────► processFolderTryOn()              │
│  └─ Process Multi ─────► processMultiFolderTryOn()         │
│                                                             │
│  Utility:                                                   │
│  └─ Reset ─────────────► resetTryOnGearState()             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Screen States

### 1. Initial State (Idle)
```
┌─────────────────────────────────┐
│  TRY-ON GEAR                    │
├─────────────────────────────────┤
│                                 │
│  Models: [○ ○ ○ ○]             │
│  No model selected              │
│                                 │
│  Accessories: All empty         │
│                                 │
│  [Try All Accessories] 🔒       │
│  (Disabled - gray)              │
│                                 │
│  Status: idle                   │
└─────────────────────────────────┘
```

### 2. Ready State
```
┌─────────────────────────────────┐
│  TRY-ON GEAR                    │
├─────────────────────────────────┤
│                                 │
│  Models: [● ○ ○ ○]             │
│  Model 1 selected ✓             │
│                                 │
│  Accessories:                   │
│  ✓ Glasses: image.jpg           │
│  ✓ Shirt: shirt.jpg             │
│                                 │
│  [Try All Accessories] 🟣       │
│  (Enabled - purple gradient)    │
│                                 │
│  Status: ready                  │
└─────────────────────────────────┘
```

### 3. Processing State
```
┌─────────────────────────────────┐
│  TRY-ON GEAR                    │
├─────────────────────────────────┤
│                                 │
│  Models: [● ○ ○ ○]             │
│  Model 1 selected ✓             │
│                                 │
│  Accessories:                   │
│  ✓ Glasses: image.jpg           │
│  ✓ Shirt: shirt.jpg             │
│                                 │
│  [Processing...] ⏳             │
│  (Disabled - loading)           │
│                                 │
│  Status: processing             │
└─────────────────────────────────┘
```

### 4. Success State
```
┌─────────────────────────────────┐
│  TRY-ON GEAR                    │
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐ │
│  │ ✓ Processing completed    │ │
│  │   successfully.           │ │
│  └───────────────────────────┘ │
│                                 │
│  Status: success                │
└─────────────────────────────────┘
```

### 5. Error State
```
┌─────────────────────────────────┐
│  TRY-ON GEAR                    │
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐ │
│  │ ⚠ Processing failed.      │ │
│  │   Please try again.       │ │
│  └───────────────────────────┘ │
│                                 │
│  Status: error                  │
└─────────────────────────────────┘
```

---

## 🎭 Modal Views

### Folder Guide Modal
```
┌─────────────────────────────────────────┐
│  📋 Folder Upload Guide          [×]    │
├─────────────────────────────────────────┤
│                                         │
│  Folder Structure:                      │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ your_folder/                      │ │
│  │ ├── model.jpeg (required)         │ │
│  │ ├── shirt.jpeg (optional)         │ │
│  │ ├── jacket.jpeg (optional)        │ │
│  │ ├── pants.jpeg (optional)         │ │
│  │ ├── shoes.jpeg (optional)         │ │
│  │ ├── glasses.jpeg (optional)       │ │
│  │ └── watch.jpeg (optional)         │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### Multi-Folder Guide Modal
```
┌─────────────────────────────────────────┐
│  📋 Multi-Folder Upload Guide    [×]    │
├─────────────────────────────────────────┤
│                                         │
│  Multi-Folder Structure:                │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ your_parent_folder/               │ │
│  │ ├── folder1/                      │ │
│  │ │   ├── model.jpeg (required)     │ │
│  │ │   ├── shirt.jpeg (optional)     │ │
│  │ │   ├── jacket.jpeg (optional)    │ │
│  │ │   ├── pants.jpeg (optional)     │ │
│  │ │   ├── shoes.jpeg (optional)     │ │
│  │ │   ├── glasses.png (optional)    │ │
│  │ │   └── watch.png (optional)      │ │
│  │ ├── folder2/                      │ │
│  │ │   └── same structure            │ │
│  │ └── folder3/                      │ │
│  │     └── same structure            │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎨 Color Palette

```
Primary Colors:
┌────────┐  ┌────────┐
│#7c3aed │  │#a855f7 │  Purple Gradient
└────────┘  └────────┘

Status Colors:
┌────────┐  ┌────────┐  ┌────────┐
│#34C759 │  │#ef4444 │  │#FFD700 │
│Success │  │ Error  │  │Warning │
└────────┘  └────────┘  └────────┘

Neutral Colors:
┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│#ffffff │  │#f5f5f5 │  │#e5e7eb │  │#333333 │
│ White  │  │  Gray  │  │ Border │  │  Text  │
└────────┘  └────────┘  └────────┘  └────────┘
```

---

## 📐 Layout Measurements

```
Screen Layout:
┌─────────────────────────────────┐
│ Header: 56px                    │ ← Fixed height
├─────────────────────────────────┤
│                                 │
│ ScrollView: flex                │ ← Scrollable
│                                 │
│ - Section Padding: 20px         │
│ - Card Padding: 12px            │
│ - Button Height: 48px           │
│ - Model Card: 100px width       │
│ - Accessory Card: 50% - 6px     │
│                                 │
└─────────────────────────────────┘

Model Card:
┌──────────┐
│   80px   │ ← Image placeholder
│   80px   │
├──────────┤
│  Model 1 │ ← Label
└──────────┘
   100px

Accessory Card:
┌────────────────────┐
│ 👓 Glasses         │ ← Icon + Label
├────────────────────┤
│ [Choose file]      │ ← Upload button
├────────────────────┤
│ image.jpg    [×]   │ ← File info (if selected)
└────────────────────┘
```

---

## 🔄 Interaction Flow

### Interactive Try-On Flow
```
1. User opens screen
   ↓
2. Selects model from slider
   ↓ (dispatch: setSelectedModel)
3. Redux state updates
   ↓
4. UI shows selected model
   ↓
5. User uploads accessory
   ↓ (dispatch: setAccessoryImage)
6. Redux state updates
   ↓
7. UI shows file name
   ↓
8. Button becomes enabled
   ↓
9. User taps "Try All Accessories"
   ↓ (dispatch: processInteractiveTryOn)
10. Status → processing
    ↓
11. API call (when implemented)
    ↓
12. Status → success/error
    ↓
13. UI shows message
```

### Folder Try-On Flow
```
1. User taps "View Guide"
   ↓
2. Modal opens with structure
   ↓
3. User closes modal
   ↓
4. User taps "Select Folder Images"
   ↓
5. Image picker opens
   ↓
6. User selects multiple images
   ↓ (dispatch: setFolderImages)
7. Redux state updates
   ↓
8. UI shows image count
   ↓
9. Button becomes enabled
   ↓
10. User taps "Process Folder"
    ↓ (dispatch: processFolderTryOn)
11. Status → processing
    ↓
12. API call (when implemented)
    ↓
13. Status → success/error
    ↓
14. UI shows message
```

---

## 🎯 Validation Rules Visual

```
Interactive Try-On:
┌─────────────────────────────────┐
│ Model Selected?                 │
│   ├─ YES ──┐                    │
│   └─ NO ───┼─► Button Disabled  │
│            │                     │
│ Accessory Uploaded?             │
│   ├─ YES ──┤                    │
│   └─ NO ───┘                    │
│                                 │
│ Both YES ──────► Button Enabled │
└─────────────────────────────────┘

Folder Try-On:
┌─────────────────────────────────┐
│ Images Selected?                │
│   ├─ YES ──► Button Enabled     │
│   └─ NO ───► Button Disabled    │
└─────────────────────────────────┘
```

---

## 📊 Status Indicator

```
Status Flow:
idle ──► ready ──► processing ──► success
  ▲                                  │
  │                                  │
  └──────────────────────────────────┘
                 or
                 ▼
               error
                 │
                 ▼
               idle (reset)
```

---

This visual guide provides a complete overview of the Try On Gear feature's UI/UX flow, component structure, and interaction patterns. Use it as a reference for understanding how the feature works visually and functionally.
