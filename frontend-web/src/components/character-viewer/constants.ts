// Attachment bone names for different body part types
// Supports multiple naming conventions (Mixamo, Xbot, new character model, etc.)
export const ATTACHMENT_BONES: Record<string, string[]> = {
  'both-legs': [
    'LeftFoot', 'RightFoot', 
    'mixamorigLeftFoot', 'mixamorigRightFoot',
    'LeftToeBase', 'RightToeBase',
    'mixamorigLeftToeBase', 'mixamorigRightToeBase',
    'thighL', 'calfL', 'footIKL',
    'thighR', 'calfR', 'footIKR'
  ],
  'left-leg': [
    'LeftFoot', 'mixamorigLeftFoot', 'LeftToeBase', 'mixamorigLeftToeBase',
    'thighL', 'calfL', 'footIKL'
  ],
  'right-leg': [
    'RightFoot', 'mixamorigRightFoot', 'RightToeBase', 'mixamorigRightToeBase',
    'thighR', 'calfR', 'footIKR'
  ],
  'top-head': [
    'Head', 'mixamorigHead', 'HeadTop_End',
    'head', 'neck2'
  ],
  'middle-head': [
    'Head', 'mixamorigHead',
    'head', 'neck1'
  ],
  'lower-head': [
    'Head', 'mixamorigHead',
    'head', 'neck1', 'neck2'
  ],
  'chest': [
    'Spine', 'Spine1', 'Spine2', 
    'mixamorigSpine', 'mixamorigSpine1', 'mixamorigSpine2',
    'UpperChest', 'Chest',
    'ribcage', 'lumbar1', 'lumbar2'
  ],
  'left-hand': [
    'LeftHand', 'mixamorigLeftHand', 'LeftHandIndex1',
    'handL', 'foreArmL', 'upperArmL'
  ],
  'right-hand': [
    'RightHand', 'mixamorigRightHand', 'RightHandIndex1',
    'handR', 'foreArmR', 'upperArmR'
  ],
}

// Scale factors for different body part types
// Scale range 1-1000 (will be divided by 10 in the component)
export const SCALE_FACTORS: Record<string, number> = {
  'both-legs': 500,
  'left-leg': 500,
  'right-leg': 500,
  'top-head': 500,
  'middle-head': 500,
  'lower-head': 500,
  'chest': 500,
  'left-hand': 500,
  'right-hand': 500,
}

// Default position offsets for different body part types
export function getDefaultOffsets(bodyPartType: string) {
  let defaultOffsetZ = 0
  let defaultOffsetY = 0
  let defaultOffsetX = 0
  
  if (bodyPartType === 'chest') {
    defaultOffsetZ = 0.5
    defaultOffsetY = 0.2
  } else if (bodyPartType === 'both-legs' || bodyPartType === 'left-leg' || bodyPartType === 'right-leg') {
    defaultOffsetZ = 0.05
    defaultOffsetY = 0
  } else if (bodyPartType === 'top-head' || bodyPartType === 'middle-head' || bodyPartType === 'lower-head') {
    defaultOffsetZ = 0.1
    defaultOffsetY = 0.05
  } else if (bodyPartType === 'left-hand' || bodyPartType === 'right-hand') {
    defaultOffsetZ = 0.05
    defaultOffsetY = 0
  }
  
  return { defaultOffsetX, defaultOffsetY, defaultOffsetZ }
}
