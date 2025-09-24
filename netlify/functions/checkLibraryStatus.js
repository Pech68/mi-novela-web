const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { user_id, novel_slug } = JSON.parse(event.body);

  if (!user_id || !novel_slug) {
    return { statusCode: 400, body: JSON.stringify({ error: "Faltan ID de usuario o slug de novela." }) };
  }

  const { data, error } = await supabase
    .from('bibliotecas')
    .select('id')
    .eq('user_id', user_id)
    .eq('novel_slug', novel_slug);

  if (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }

  // Si data tiene elementos, significa que la novela ya está en la biblioteca
  return {
    statusCode: 200,
    body: JSON.stringify({ isInLibrary: data.length > 0 })
  };
};
