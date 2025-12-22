#!/usr/bin/env node

// Test script for email functionality
// Run with: node scripts/test-email.js

import dotenv from 'dotenv';
import { testSmtpSend, sendVerificationEmail } from '../utils/smtpEmailSender.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testEmail() {
  console.log('🧪 Starting email test...\n');
  
  // Test 1: Check environment variables
  console.log('📋 Environment Variables Check:');
  const requiredVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'FROM_EMAIL'];
  const missingVars = [];
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: Set`);
    } else {
      console.log(`❌ ${varName}: Missing`);
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    console.log(`\n❌ Missing required environment variables: ${missingVars.join(', ')}`);
    console.log('Please check your .env.local file and ensure all SMTP variables are set.');
    process.exit(1);
  }
  
  console.log('\n📧 Testing SMTP connection and email sending...\n');
  
  // Test 2: Basic SMTP test
  try {
    console.log('Test 1: Basic SMTP test');
    const testResult = await testSmtpSend(process.env.SMTP_TEST_TO);
    
    if (testResult.success) {
      console.log('✅ Basic SMTP test passed!');
      console.log(`   Message ID: ${testResult.messageId}`);
    } else {
      console.log('❌ Basic SMTP test failed:');
      console.log(`   Error: ${testResult.error}`);
      return;
    }
  } catch (error) {
    console.log('❌ Basic SMTP test failed with exception:');
    console.log(`   Error: ${error.message}`);
    return;
  }
  
  console.log('\n');
  
  // Test 3: Verification email test
  try {
    console.log('Test 2: Verification email test');
    const verifyLink = 'https://blogspace-app-un4j.onrender.com/api/user/verify?token=test123';
    const verifyResult = await sendVerificationEmail(
      process.env.SMTP_TEST_TO, 
      'Test User', 
      verifyLink
    );
    
    if (verifyResult.success) {
      console.log('✅ Verification email test passed!');
      console.log(`   Message ID: ${verifyResult.messageId}`);
    } else {
      console.log('❌ Verification email test failed');
    }
  } catch (error) {
    console.log('❌ Verification email test failed with exception:');
    console.log(`   Error: ${error.message}`);
    return;
  }
  
  console.log('\n🎉 All email tests completed successfully!');
  console.log('📬 Check your email inbox for the test messages.');
  console.log('\nIf you received both emails, your SMTP configuration is working correctly.');
}

// Run the test
testEmail().catch(error => {
  console.error('💥 Test script failed:', error.message);
  process.exit(1);
});