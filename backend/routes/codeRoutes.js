const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const supabase = require('../supabaseClient');

// CREATE CODE
router.post('/create', async (req, res) => {
  try {
    const { message, instagram } = req.body;

    const code = nanoid(5);

    const { data, error } = await supabase
      .from('codes')
      .insert([{ code, message, instagram }]);

    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Insert failed" });
    }

    res.json({ code });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET CODE
router.get('/code/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('codes')
      .select('*')
      .eq('code', req.params.id)
      .maybeSingle();

    if (error || !data) {
      return res.status(404).json({ msg: "Not found" });
    }

    // ⏳ TIME DEBUG
    // const createdTime = new Date(data.created_at).getTime();
    const createdTime = new Date(data.created_at + "Z").getTime();
    const now = Date.now();

    const diffMs = now - createdTime;

    console.log("----------- TIME DEBUG -----------");
    console.log("created_at (raw):", data.created_at);
    console.log("createdTime (ms):", createdTime);
    console.log("now (ms):", now);
    console.log("diffMs:", diffMs);
    console.log("----------------------------------");

    // ⏳ EXPIRY CHECK (10 minute)
    // if (diffMs >5* 60 * 1000) {
    //   return res.status(410).json({ msg: "Code expired" });
    // }

    // ✅ SEND DATA FIRST
    res.json(data);

    // 🔥 ONE-TIME VIEW
    // setTimeout(async () => {
    //   await supabase
    //     .from('codes')
    //     .delete()
    //     .eq('code', req.params.id);
    // }, 5*60*1000);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

//POST response
router.post('/respond',async (req,res) => {
  try {
    const {code,instagram,message} = req.body;
    const{error} = await supabase
    .from('codes')
    .update({
      response_instagram:instagram,
      response_message: message,
      responder_interested:true
    })
    .eq('code',code);
    if (error){
      return res.status(500).json({msg: "Failed to save response"});
    }
    res.json({msg: "Response saved"});
  } catch(err) {
    res.status(500).json({error: "Server error"});
  }
});
router.post('/creator-interest', async (req, res) => {
  const { code } = req.body;

  await supabase
    .from('codes')
    .update({
      creator_interested: true
    })
    .eq('code', code);

  res.json({ msg: "Creator interested" });
});
router.get('/match/:code', async (req, res) => {
  const { data } = await supabase
    .from('codes')
    .select('*')
    .eq('code', req.params.code)
    .maybeSingle();
  if(!data){
    return res.json({match :false});
  }
  if (data.creator_interested && data.responder_interested) {
    return res.json({
      match: true,
      creator_instagram: data.instagram,
      responder_instagram: data.response_instagram,
      responder_message: data.response_message
    });
  }

  res.json({ match: false });
});
router.get('/responses/:code', async (req, res) => {
  const { data, error } = await supabase
    .from('codes')
    .select('response_instagram, response_message, is_interested')
    .eq('code', req.params.code)
    .single();

  res.json(data);
});

// SEND MESSAGE
router.post('/send-message', async (req, res) => {
  const { code, sender, message } = req.body;

  const { error } = await supabase
    .from('messages')
    .insert([{ code, sender, message }]);

  if (error) return res.status(500).json({ msg: "Failed" });

  res.json({ msg: "Sent" });
});


// GET MESSAGES
router.get('/messages/:code', async (req, res) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('code', req.params.code)
    .order('created_at', { ascending: true });

  res.json(data);
});

module.exports = router;