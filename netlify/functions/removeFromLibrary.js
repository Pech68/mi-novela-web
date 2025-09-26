const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { user_id, novel_slug } = JSON.parse(event.body);

  // Le pedimos a Supabase que elimine la fila que coincida con el usuario y la novela
  const { data, error } = await supabase
    .from('bibliotecas')
    .delete()
    .match({ user_id: user_id, novel_slug: novel_slug });

  if (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "¡Novela retirada de la biblioteca!" })
  };
};
