/**
 * Vercel API Endpoint - HMRC Tax Guidance
 * Production-ready endpoint for JuriBank educational platform
 */

import { hmrcKnowledgeHub } from '../src/hmrc-integration.js';

export default async function handler(req, res) {
  // Set CORS headers for educational platform
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=300'); // 30 min cache

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      console.log('📊 HMRC Tax Guidance API called');
      
      const guidance = await hmrcKnowledgeHub.getTaxGuidanceForFinancialDisputes();
      
      res.status(200).json({
        success: true,
        data: guidance,
        timestamp: new Date().toISOString(),
        source: 'HMRC Educational Guidance',
        educationalNote: 'Tax guidance for educational purposes - JuriBank Platform v3.0'
      });
      
    } else if (req.method === 'POST') {
      const { type, amount, context = {} } = req.body;
      
      if (!type || !amount) {
        res.status(400).json({
          success: false,
          error: 'Missing required parameters: type and amount'
        });
        return;
      }

      console.log(`💰 Tax calculation request: ${type}, £${amount}`);
      
      const calculation = hmrcKnowledgeHub.calculateTaxImplications(type, amount, context);
      
      res.status(200).json({
        success: true,
        data: calculation,
        timestamp: new Date().toISOString(),
        educationalNote: 'Educational calculation only - consult tax professional for advice'
      });
      
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('❌ HMRC Tax Guidance API Error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Unable to fetch tax guidance',
      educationalNote: 'Educational tax guidance available in fallback mode',
      timestamp: new Date().toISOString()
    });
  }
}