# CouponInput Component

## Overview

The `CouponInput` component is a reusable, self-contained component that handles all coupon-related functionality including validation, application, and removal. It has been extracted from the CheckoutPage and OrderSummary components to improve code organization and reusability.

## Features

- **Real-time Validation**: Uses the `useCoupons` hook and Redux for API calls
- **Comprehensive Validation**: Checks coupon status, dates, minimum amounts, and usage limits
- **Loading States**: Shows validation progress and disables inputs during API calls
- **Error Handling**: Displays specific error messages for different validation failures
- **Dynamic Discount Calculation**: Supports both PERCENTAGE and FIXED coupon types
- **Responsive Design**: Mobile-friendly layout with proper touch targets

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `subtotal` | `number` | ✅ | Cart subtotal for minimum amount validation |
| `onCouponApplied` | `function` | ❌ | Callback when coupon is successfully applied |
| `onCouponRemoved` | `function` | ❌ | Callback when coupon is removed |
| `className` | `string` | ❌ | Additional CSS classes |
| `disabled` | `boolean` | ❌ | Disable the entire component |

## Usage

### Basic Implementation
```jsx
import CouponInput from './components/CouponInput';

<CouponInput
  subtotal={subtotal}
  onCouponApplied={handleCouponApplied}
  onCouponRemoved={handleCouponRemoved}
/>
```

### With Custom Styling
```jsx
<CouponInput
  subtotal={subtotal}
  className="custom-coupon-style"
  onCouponApplied={handleCouponApplied}
  onCouponRemoved={handleCouponRemoved}
/>
```

### Disabled State
```jsx
<CouponInput
  subtotal={subtotal}
  disabled={isProcessing}
  onCouponApplied={handleCouponApplied}
  onCouponRemoved={handleCouponRemoved}
/>
```

## Callbacks

### onCouponApplied(coupon)
Called when a coupon is successfully validated and applied.

**Parameters:**
- `coupon` (object): The validated coupon object with all properties

**Example:**
```jsx
const handleCouponApplied = (coupon) => {
  // Calculate discount based on coupon type
  let discount = 0;
  if (coupon.type === 'PERCENTAGE') {
    discount = (subtotal * coupon.value) / 100;
  } else if (coupon.type === 'FIXED') {
    discount = Math.min(coupon.value, subtotal);
  }
  setDiscountAmount(discount);
};
```

### onCouponRemoved()
Called when a coupon is removed (either manually or due to validation failure).

**Example:**
```jsx
const handleCouponRemoved = () => {
  setDiscountAmount(0);
  // Clear any coupon-related state
};
```

## Validation Logic

The component performs the following validation checks:

1. **Coupon Existence**: Verifies the coupon code exists in the system
2. **Active Status**: Ensures the coupon is currently active
3. **Date Validity**: Checks if the coupon is within its valid date range
4. **Minimum Order Amount**: Validates the cart subtotal meets requirements
5. **Usage Limits**: Ensures the coupon hasn't exceeded its maximum usage

## Styling

The component includes its own CSS file (`CouponInput.css`) with:
- Responsive design for mobile and desktop
- Consistent styling with the existing design system
- Proper focus states and accessibility
- Loading and disabled state styles

## Dependencies

- `useCoupons` hook for Redux integration
- `lucide-react` for icons
- React hooks (`useState`, `useEffect`)

## Architecture

The component follows the established pattern:
1. **Hooks Layer**: Uses `useCoupons` for Redux state management
2. **Service Layer**: Coupon validation through the coupon service
3. **API Layer**: Real backend integration for validation
4. **UI Layer**: Clean, reusable component interface

## Migration from Old Implementation

### Before (CheckoutPage)
```jsx
// Old inline coupon implementation
const [couponCode, setCouponCode] = useState('');
const [couponApplied, setCouponApplied] = useState(false);
const [couponError, setCouponError] = useState('');

// Complex validation logic in useEffect
// Manual error handling
// Inline JSX for coupon input
```

### After (CouponInput)
```jsx
// Clean, reusable component
<CouponInput
  subtotal={subtotal}
  onCouponApplied={handleCouponApplied}
  onCouponRemoved={handleCouponRemoved}
/>

// Simple callback handlers
const handleCouponApplied = (coupon) => {
  // Handle successful coupon application
};
```

## Benefits of Reorganization

1. **Reusability**: Can be used in multiple components
2. **Maintainability**: Single source of truth for coupon logic
3. **Testability**: Easier to unit test in isolation
4. **Consistency**: Same behavior across different implementations
5. **Separation of Concerns**: Clear separation between UI and business logic
