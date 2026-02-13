# YAR-WAHTSAPP Deployment Runbook

## Overview
This runbook describes the process for building and deploying the YAR-WAHTSAPP frontend to the live (production) environment on the Internet Computer.

**Important:** This deployment promotes the current application state to production without introducing new features or UI changes.

## Prerequisites

### Environment Requirements
- Node.js 18+ and pnpm installed
- DFX CLI installed and configured
- Access to the production canister IDs
- Internet connection for Internet Identity integration

### Pre-Deployment Checklist

#### 1. Verify English UI Text
All user-facing text must be in English. Key areas to verify:
- **AuthScreen** (`frontend/src/features/auth/AuthScreen.tsx`): "Get Started", "YAR-WAHTSAPP", feature descriptions
- **ProfileSetupDialog** (`frontend/src/features/profile/ProfileSetupDialog.tsx`): "Set Up Your Profile", form labels
- **ChatLayout** (`frontend/src/features/chat/ChatLayout.tsx`): "New Chat", "Logout" buttons
- **NewChat** (`frontend/src/features/chat/NewChat.tsx`): "Start New Conversation" heading
- **MessageComposer** (`frontend/src/features/chat/MessageComposer.tsx`): "Type a message..." placeholder

#### 2. Verify Assets
Confirm the following assets are present in the `frontend/public/assets/generated/` directory:
- `yar-wahtsapp-icon.dim_1024x1024.png`
- `yar-wahtsapp-logo.dim_512x512.png`

#### 3. Code Quality
- Run TypeScript type checking: `pnpm typescript-check`
- Run linter: `pnpm lint`
- Ensure no console errors in development mode

## Build Process

### Step 1: Install Dependencies
