/*
 * CONFIGURAÇÃO DA OFERTA
 * Edite somente este arquivo para conectar o funil ao SEU checkout e ao SEU vídeo.
 */
window.OFFER_CONFIG = {
  // Link do seu checkout (os parâmetros UTM da visita são anexados automaticamente).
  checkoutUrl: "https://go.perfectpay.com.br/PPU38CQHK0R",

  // Vídeo da página final (escolha UMA opção):
  // 1) Player VTurb/ConverteAI: preencha accountId e playerId.
  vturb: { accountId: "85b1882e-3999-422a-8e06-9a812220edbe", playerId: "6af1ffefef00c0c884aae84c" },
  // 2) Ou um link direto: YouTube, Vimeo ou arquivo .mp4.
  videoUrl: "assets/video/vsl.mp4",

  // Tempo (em segundos) até a oferta aparecer abaixo do vídeo. Original: 323 s.
  revealDelaySeconds: 323,

  // Preços exibidos na oferta.
  priceFrom: 297,
  priceTo: 37.9,

  // Contador de urgência (minutos) e vagas iniciais.
  countdownMinutes: 10,
  initialSpots: 7
};
