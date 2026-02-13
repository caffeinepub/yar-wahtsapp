# YAR-WAHTSAPP Live Environment Smoke Test Checklist

## Purpose
This checklist validates that the deployed YAR-WAHTSAPP application is functioning correctly in the live environment without introducing new features or UI changes.

## Test Environment
- **URL:** [Insert deployed canister URL]
- **Network:** Internet Computer Mainnet
- **Browser:** Chrome/Firefox/Safari (latest versions)
- **Test Date:** _____________
- **Tester:** _____________

---

## Pre-Test Setup

- [ ] Clear browser cache and cookies
- [ ] Open browser DevTools console
- [ ] Prepare two test Internet Identity principals (for conversation testing)

---

## Test Cases

### 1. Initial Load & Authentication

#### 1.1 Landing Page (AuthScreen)
- [ ] Page loads without errors (check console)
- [ ] YAR-WAHTSAPP logo displays correctly (`/assets/generated/yar-wahtsapp-logo.dim_512x512.png`)
- [ ] "YAR-WAHTSAPP" heading is visible
- [ ] "Connect with friends and family instantly" tagline displays
- [ ] Feature cards show "Instant Messaging" and "Secure & Private"
- [ ] "Get Started" button is visible and enabled
- [ ] Footer displays "Built with ❤️ using caffeine.ai" with correct UTM link
- [ ] Footer shows current year (2026)

#### 1.2 Internet Identity Login
- [ ] Click "Get Started" button
- [ ] Internet Identity modal opens
- [ ] Complete authentication flow
- [ ] Redirected back to application after successful login
- [ ] No console errors during authentication

### 2. Profile Setup (First-Time Users Only)

#### 2.1 Profile Setup Dialog
- [ ] Dialog appears automatically for new users
- [ ] "Set Up Your Profile" heading displays
- [ ] Name input field is present and functional
- [ ] "Choose Avatar" button is present
- [ ] "Save Profile" button is disabled until name is entered
- [ ] Enter a name (e.g., "Test User")
- [ ] "Save Profile" button becomes enabled
- [ ] Click "Save Profile"
- [ ] Dialog closes after successful save
- [ ] No console errors

#### 2.2 Avatar Upload (Optional)
- [ ] Click "Choose Avatar" button
- [ ] File picker opens
- [ ] Select an image file (< 2MB)
- [ ] Avatar preview displays
- [ ] Save profile with avatar
- [ ] Avatar persists after save

### 3. Chat Layout

#### 3.1 Desktop View (> 768px width)
- [ ] Sidebar is visible on the left
- [ ] Sidebar header shows user avatar (if uploaded) or YAR-WAHTSAPP icon
- [ ] "YAR-WAHTSAPP" title displays in sidebar header
- [ ] Logout button (icon) is visible in sidebar header
- [ ] "New Chat" button is visible and styled with emerald background
- [ ] Main content area shows empty state with logo and "Select a chat to start messaging"

#### 3.2 Mobile View (< 768px width)
- [ ] Sidebar is hidden by default
- [ ] Mobile header displays with menu icon, YAR-WAHTSAPP title, and logout button
- [ ] Click menu icon opens sidebar overlay
- [ ] Sidebar overlay has dark backdrop
- [ ] Click backdrop closes sidebar
- [ ] "X" button in sidebar closes overlay

#### 3.3 User Avatar Display
- [ ] If avatar was uploaded: user avatar displays in header
- [ ] If no avatar: YAR-WAHTSAPP icon displays as fallback
- [ ] Avatar/icon is properly sized and styled

### 4. New Conversation Flow

#### 4.1 Start New Chat
- [ ] Click "New Chat" button
- [ ] Main content switches to "Start New Conversation" view
- [ ] "Principal ID" input field is visible
- [ ] "Start Chat" button is visible
- [ ] Paste a valid Principal ID (from second test identity)
- [ ] Click "Start Chat"
- [ ] Conversation is created successfully
- [ ] View switches to chat detail for new conversation

### 5. Chat List

#### 5.1 Conversation Display
- [ ] New conversation appears in sidebar chat list
- [ ] Conversation shows other participant's name (if they have a profile) or Principal ID
- [ ] Avatar displays for participant (if available)
- [ ] No messages show "No messages yet"
- [ ] Click conversation selects it (highlighted state)

### 6. Chat Detail & Messaging

#### 6.1 Chat View
- [ ] Chat header shows participant name/ID
- [ ] Message area is empty for new conversation
- [ ] Message composer (textarea) is visible at bottom
- [ ] "Type a message..." placeholder displays
- [ ] Send button (paper plane icon) is visible

#### 6.2 Send Message
- [ ] Type a message in the textarea
- [ ] Press Enter or click send button
- [ ] Message appears in chat timeline
- [ ] Message shows on the right side (sender bubble)
- [ ] Message displays correct content
- [ ] Timestamp is visible
- [ ] Textarea clears after sending

#### 6.3 Receive Message (Two-User Test)
- [ ] Login with second test identity in another browser/incognito
- [ ] Navigate to the same conversation
- [ ] Send a message from second identity
- [ ] Return to first identity's browser
- [ ] Message appears on the left side (receiver bubble)
- [ ] Message content and timestamp are correct
- [ ] Auto-scroll to latest message works

### 7. Logout

#### 7.1 Logout Flow
- [ ] Click logout button
- [ ] User is logged out
- [ ] Redirected to AuthScreen
- [ ] All cached data is cleared
- [ ] No console errors

---

## Validation Criteria

### ✅ Pass Criteria
- All checklist items marked as complete
- No critical console errors
- All English text displays correctly
- Authentication flow works end-to-end
- Messages send and receive successfully
- UI matches expected design (emerald/teal theme)

### ❌ Fail Criteria
- Any authentication failures
- Messages fail to send or receive
- Console errors that block functionality
- Missing or broken assets
- UI text in non-English language
- Layout broken on mobile or desktop

---

## Notes & Issues

**Issues Found:**
_____________________________________________
_____________________________________________
_____________________________________________

**Performance Observations:**
_____________________________________________
_____________________________________________

**Browser Compatibility:**
- Chrome: ☐ Pass ☐ Fail
- Firefox: ☐ Pass ☐ Fail  
- Safari: ☐ Pass ☐ Fail

---

## Sign-Off

**Tester Signature:** _______________ **Date:** _______________

**Deployment Approved:** ☐ Yes ☐ No (requires fixes)

**Notes:**
_____________________________________________
_____________________________________________
