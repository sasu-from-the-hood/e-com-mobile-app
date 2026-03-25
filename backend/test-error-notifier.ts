import 'dotenv/config';
import { logger } from './src/utils/logger.js';

async function testErrorNotifier() {
  console.log('🧪 Testing error notifier system...\n');
  
  const devEmails = process.env.DEV_EMAIL 
    ? process.env.DEV_EMAIL.split(',').map(e => e.trim()).filter(e => e)
    : [];
  
  console.log('Configuration:');
  console.log('- DEV_EMAIL:', devEmails.length > 0 ? devEmails.join(', ') : '❌ NOT SET');
  console.log('- EMAIL_FROM:', process.env.EMAIL_FROM || '❌ NOT SET');
  console.log('- EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ SET' : '❌ NOT SET');
  console.log('- Errors will be saved to: logs/errors/\n');

  console.log('📝 Logging test errors...\n');

  try {
    // Test error 1
    logger.error('Test Error: Database connection failed', {
      testType: 'manual',
      timestamp: new Date().toISOString(),
      database: 'postgresql',
      host: 'localhost',
      port: 5432,
    });

    console.log('✅ First error logged\n');

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test error 2
    logger.error('Test Error: API request timeout', {
      testType: 'manual',
      endpoint: '/api/products',
      method: 'GET',
      timeout: 30000,
      userId: 'test-user-123',
    });

    console.log('✅ Second error logged\n');

    // Wait for async operations to complete
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('✅ Test completed successfully!');
    console.log('\nCheck the following:');
    console.log('1. 📁 logs/errors/ directory for error JSON files');
    console.log('2. 📧 Your email inbox at:', devEmails.join(', ') || 'not configured');
    console.log('3. 📋 Console output above for error notifications');
    console.log('\nNote: Email may fail if SMTP is blocked, but errors are saved to files.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:');
    console.error(error);
    process.exit(1);
  }
}

testErrorNotifier();
