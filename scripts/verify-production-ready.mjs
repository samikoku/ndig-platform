#!/usr/bin/env node

/**
 * Diaspora Insight production readiness verification
 * Checks: doctrine compliance, routes, admin procedures, mail rules
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

console.log('🔍 Diaspora Insight Production Readiness Verification\n');
console.log(`Timestamp: ${new Date().toISOString()}\n`);

const checks = [];
let allPassed = true;

// Check 1: Doctrine compliance
console.log('1️⃣  Doctrine Compliance...');
try {
  const siteCopy = fs.readFileSync(
    path.join(projectRoot, 'client/src/config/siteCopy.ts'),
    'utf-8'
  );
  
  const bannedPhrases = [
    /\bshould\b/i,
    /\bwill\b/i,
    /\bguaranteed\b/i,
    /government\s+backing/i,
    /unsourced/i
  ];
  
  let doctrinePass = true;
  for (const phrase of bannedPhrases) {
    if (phrase.test(siteCopy)) {
      console.log(`   ⚠️  Found banned phrase: ${phrase.source}`);
      doctrinePass = false;
    }
  }
  
  if (doctrinePass) {
    console.log('   ✅ No banned phrases detected');
  } else {
    allPassed = false;
  }
  
  if (siteCopy.includes('Seen a scheme? The desk wants it.')) {
    console.log('   ✅ TIP_LINE confirmed');
  } else {
    console.log('   ❌ TIP_LINE not found');
    allPassed = false;
  }
  
  checks.push({ name: 'Doctrine', pass: doctrinePass });
} catch (err) {
  console.log(`   ❌ Error: ${err.message}`);
  allPassed = false;
}

// Check 2: Admin procedures secured
console.log('\n2️⃣  Admin Access Control...');
try {
  const insightRouter = fs.readFileSync(
    path.join(projectRoot, 'server/insight.ts'),
    'utf-8'
  );
  
  const adminProcedures = [
    'adminUnprocessed',
    'adminUpdate',
    'adminGetTip',
    'adminReadyForArticle',
    'adminPublishArticle'
  ];
  
  let adminPass = true;
  for (const proc of adminProcedures) {
    if (!insightRouter.includes(`${proc}:`)) {
      console.log(`   ⚠️  Procedure missing: ${proc}`);
      adminPass = false;
    } else if (!insightRouter.includes('protectedProcedure')) {
      console.log(`   ⚠️  Procedure not protected: ${proc}`);
      adminPass = false;
    }
  }
  
  if (insightRouter.includes('ctx.user?.role !== "admin"')) {
    console.log('   ✅ Admin role checks in place');
  } else {
    console.log('   ⚠️  Admin role check might be missing');
  }
  
  if (adminPass) {
    console.log('   ✅ All admin procedures secured');
  }
  
  checks.push({ name: 'Admin Access', pass: adminPass });
} catch (err) {
  console.log(`   ❌ Error: ${err.message}`);
  allPassed = false;
}

// Check 3: Mail rules enforced
console.log('\n3️⃣  Mail Rules...');
try {
  const mailRouting = fs.readFileSync(
    path.join(projectRoot, 'server/mailRouting.ts'),
    'utf-8'
  );
  
  let mailPass = true;
  
  // Rule 1: smi@ forbidden except digest
  if (mailRouting.includes('smi@ndigateway.org') && mailRouting.includes('FORBIDDEN')) {
    console.log('   ✅ smi@ rule: Forbidden except digest');
  } else {
    console.log('   ❌ smi@ rule not found');
    mailPass = false;
  }
  
  // Rule 2: sendInsightDigests function
  if (mailRouting.includes('sendInsightDigests')) {
    console.log('   ✅ Insight digest function implemented');
    
    if (mailRouting.includes('press@ndigateway.org')) {
      console.log('   ✅ press@ routing configured');
    } else {
      console.log('   ⚠️  press@ routing not found');
    }
  } else {
    console.log('   ❌ sendInsightDigests function not found');
    mailPass = false;
  }
  
  checks.push({ name: 'Mail Rules', pass: mailPass });
} catch (err) {
  console.log(`   ❌ Error: ${err.message}`);
  allPassed = false;
}

// Check 4: Routes registered
console.log('\n4️⃣  Route Registration...');
try {
  const appRouter = fs.readFileSync(
    path.join(projectRoot, 'server/routers.ts'),
    'utf-8'
  );
  
  let routePass = true;
  
  if (appRouter.includes('insightRouter')) {
    console.log('   ✅ insightRouter registered');
  } else {
    console.log('   ❌ insightRouter not registered');
    routePass = false;
  }
  
  checks.push({ name: 'Routes', pass: routePass });
} catch (err) {
  console.log(`   ❌ Error: ${err.message}`);
  allPassed = false;
}

// Check 5: Cron configured
console.log('\n5️⃣  Cron Job...');
try {
  const cronJobs = fs.readFileSync(
    path.join(projectRoot, 'server/cronJobs.ts'),
    'utf-8'
  );
  
  let cronPass = true;
  
  if (cronJobs.includes('runDailyInsightReview')) {
    console.log('   ✅ Daily insight review job defined');
  } else {
    console.log('   ❌ Cron job not found');
    cronPass = false;
  }
  
  if (cronJobs.includes('0 8 * * *') || cronJobs.includes('9 AM')) {
    console.log('   ✅ Cron schedule set (9 AM Lagos)');
  } else {
    console.log('   ⚠️  Cron schedule might be incorrect');
  }
  
  checks.push({ name: 'Cron', pass: cronPass });
} catch (err) {
  console.log(`   ❌ Error: ${err.message}`);
  allPassed = false;
}

// Check 6: Webhook endpoint
console.log('\n6️⃣  Email Webhook...');
try {
  const apiHandler = fs.readFileSync(
    path.join(projectRoot, 'server/apiHandler.ts'),
    'utf-8'
  );
  
  let webhookPass = true;
  
  if (apiHandler.includes('/api/webhooks/email-inbound')) {
    console.log('   ✅ Email webhook endpoint defined');
  } else {
    console.log('   ❌ Webhook endpoint not found');
    webhookPass = false;
  }
  
  if (apiHandler.includes('[ARTICLE-APPROVED]')) {
    console.log('   ✅ Article approval subject parsing in place');
  } else {
    console.log('   ⚠️  Article approval parsing not found');
  }
  
  checks.push({ name: 'Webhook', pass: webhookPass });
} catch (err) {
  console.log(`   ❌ Error: ${err.message}`);
  allPassed = false;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📋 Summary\n');

for (const check of checks) {
  const status = check.pass ? '✅' : '❌';
  console.log(`${status} ${check.name}`);
}

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('\n✅ PRODUCTION READY\n');
  process.exit(0);
} else {
  console.log('\n⚠️  ISSUES FOUND - REVIEW ABOVE\n');
  process.exit(1);
}
