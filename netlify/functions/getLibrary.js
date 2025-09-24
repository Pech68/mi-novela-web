const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Obtenemos el ID del usuario que hace la petición
  const { user_id } = JSON.parse(event.body);

  if (!user_id) {
    return { statusCode: 400, body: JSON.stringify({ error: "Falta el ID del usuario." }) };
  }

  // Pedimos a Supabase todas las filas de la tabla "bibliotecas" que coincidan con el ID del usuario
  const { data, error } = await supabase
    .from('bibliotecas')
    .select('novel_slug')
    .eq('user_id', user_id);

  if (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }

  // Devolvemos la lista de slugs de las novelas guardadas
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
