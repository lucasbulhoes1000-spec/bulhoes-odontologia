/* =====================================================
   LUME: rastreamento dos cliques (08/11/2026)
   Grava o clique direto no Lume (substitui a planilha) e gera um
   código invisível que vai no fim da mensagem do WhatsApp. Quando a
   mensagem chega, o Lume liga o lead a este clique (perfil, bio ou
   story, campanha). A pessoa não vê o código.
===================================================== */
window.LumeClique = (function () {
  var URL_RPC = "https://gcxuikfjyajlmqbqlyca.supabase.co/rest/v1/rpc/registrar_clique";
  var CHAVE = "sb_publishable_OMTsAJNgLiM3wQfZrU3Q3Q_g5mvMuEc";
  var B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

  function codigo() {
    var a = new Uint8Array(6), s = "";
    try { (window.crypto || window.msCrypto).getRandomValues(a); }
    catch (e) { for (var j = 0; j < 6; j++) a[j] = Math.floor(Math.random() * 256); }
    for (var i = 0; i < 6; i++) s += B32.charAt(a[i] & 31);
    return s;
  }

  function invisivel(c) {
    var b = "";
    for (var i = 0; i < c.length; i++) {
      var v = B32.indexOf(c.charAt(i));
      for (var k = 4; k >= 0; k--) b += ((v >> k) & 1) ? "⁣" : "⁢";
    }
    return "⁠" + b + "⁠";
  }

  /* link do WhatsApp com o código no fim da mensagem pronta */
  function linkComCodigo(link, c) {
    try {
      var partes = String(link).split("?");
      var texto = "";
      if (partes[1]) {
        var q = partes[1].split("&");
        for (var i = 0; i < q.length; i++) {
          if (q[i].indexOf("text=") === 0) texto = decodeURIComponent(q[i].slice(5).replace(/\+/g, " "));
        }
      }
      return partes[0] + "?text=" + encodeURIComponent(texto + invisivel(c));
    } catch (e) { return link; }
  }

  function registrar(dados) {
    try {
      fetch(URL_RPC, {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json", apikey: CHAVE, Authorization: "Bearer " + CHAVE },
        body: JSON.stringify({ p: dados })
      }).catch(function () {});
    } catch (e) {}
  }

  return { codigo: codigo, invisivel: invisivel, linkComCodigo: linkComCodigo, registrar: registrar };
})();
