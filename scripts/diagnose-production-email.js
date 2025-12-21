const fetch = require('node-fetch');

async function diagnoseProductionEmail() {
  console.log('🔍 Diagnosing production email issues\n');
  
  console.log('📋 Checklist for Render Environment Variables:');
  console.log('');
  console.log('Required variables on Render dashboard:');
  console.log('   ✓ MONGO_URI - Database connection');
  console.log('   ✓ NEXT_PUBLIC_BASE_URL - Production URL');
  console.log('   ✓ SMTP_HOST - smtp.gmail.com');
  console.log('   ✓ SMTP_PORT - 587');
  console.log('   ✓ SMTP_SECURE - false');
  console.log('   ✓ SMTP_USER - dhanyasrikalisamy@gmail.com');
  console.log('   ✓ SMTP_PASS - Your Gmail App Password');
  console.log('   ✓ FROM_EMAIL - dhanyasrikalisamy@gmail.com');
  console.log('');
  
  console.log('🔧 How to fix:');
  console.log('1. Go to https://dashboard.render.com/');
  console.log('2. Click on your blogspace-app service');
  console.log('3. Click "Environment" in the sidebar');
  console.log('4. Add each variable listed above');
  console.log('5. Click "Save Changes" and wait for redeploy');
  console.log('');
  
  console.log('🚨 Common Issues:');
  console.log('');
  console.log('❌ Issue: SMTP variables not set on Render');
  console.log('   Solution: Add all SMTP_* variables to Render dashboard');
  console.log('');
  console.log('❌ Issue: Wrong Gmail App Password');
  console.log('   Solution: Generate new App Password in Gmail settings');
  console.log('   Steps: Gmail → Settings → Security → 2-Step Verification → App passwords');
  console.log('');
  console.log('❌ Issue: Gmail blocking login');
  console.log('   Solution: Use App Password, not regular password');
  console.log('');
  console.log('❌ Issue: Environment variables not loaded');
  console.log('   Solution: Redeploy after adding variables');
  console.log('');
  
  console.log('🧪 Testing production registration again...');
  
  try {
    const timestamp = Date.now();
    const testUser = {
      username: 'diagtest' + timestamp,
      email: `dhanyasrikalisamy+diag${timestamp}@gmail.com`,
      password: 'testpass123'
    };
    
    const response = await fetch('https://blogspace-app-un4j.onrender.com/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Registration API works');
      console.log('📧 Response says email was sent');
      console.log('');
      console.log('🔍 If you\'re not receiving emails, the issue is likely:');
      console.log('   1. SMTP environment variables not set on Render');
      console.log('   2. Gmail App Password expired or incorrect');
      console.log('   3. Emails going to spam folder');
      console.log('');
      console.log('📧 Check your email now for: ' + testUser.email);
    } else {
      console.log('❌ Registration failed:', result.message);
    }
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
  }
}

diagnoseProductionEmail();