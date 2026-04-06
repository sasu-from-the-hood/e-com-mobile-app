import { mysqlTable, text, timestamp, int, decimal, varchar } from 'drizzle-orm/mysql-core'

export const threeDModels = mysqlTable('3d_models', {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text('name').notNull(),
  bodyPartType: text('body_part_type').notNull(),
  colorName: text('color_name'),
  colorHex: text('color_hex'),
  prompt: text('prompt').notNull(),
  
  // File paths
  leftLegFile: text('left_leg_file'),
  rightLegFile: text('right_leg_file'),
  
  // File sizes
  leftLegSize: int('left_leg_size'),
  rightLegSize: int('right_leg_size'),
  leftLegOriginalSize: int('left_leg_original_size'),
  rightLegOriginalSize: int('right_leg_original_size'),
  
  // Scale and Position
  scale: decimal('scale', { precision: 10, scale: 2 }).default('1.0'),
  positionX: decimal('position_x', { precision: 10, scale: 2 }).default('0.0'),
  positionY: decimal('position_y', { precision: 10, scale: 2 }).default('0.0'),
  positionZ: decimal('position_z', { precision: 10, scale: 2 }).default('0.0'),
  
  // Parameters
  inferenceSteps: int('inference_steps'),
  guidanceScale: decimal('guidance_scale', { precision: 10, scale: 2 }),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
