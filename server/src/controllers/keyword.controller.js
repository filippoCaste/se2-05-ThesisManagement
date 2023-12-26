"use strict";

import { getAllKeywords } from '../../src/services/keyword.services.js';
import { getAllKeywordsWithProposalId }  from '../../src/services/keyword.services.js';

export const getKeywords = async (req, res) => {
  try {
    const result = await getAllKeywords();
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


export const  getKeywordsWithProposalId= async (req, res) => {
  try {
    
    const result = await getAllKeywordsWithProposalId();
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
