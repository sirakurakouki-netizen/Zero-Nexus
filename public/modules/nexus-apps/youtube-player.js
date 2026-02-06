export const YoutubePlayer = {
    launch(windowManager) {
        const content = `
            <div style="padding:10px; color:#f00; height:100%; display:flex; flex-direction:column;">
                <input type="text" id="yt-id" placeholder="Video ID (ex: dQw4w9WgXcQ)" 
                       style="width:90%; background:#111; color:#f00; border:1px solid #f00; margin-bottom:10px;">
                <div id="yt-video-area" style="flex:1; background:#000;">
                    <p style="text-align:center; padding-top:20%;">Enter ID and tap outside</p>
                </div>
            </div>
        `;
        windowManager.createWindow('app-youtube', 'NEXUS-YOUTUBE', content);

        setTimeout(() => {
            const input = document.getElementById('yt-id');
            input.onchange = () => {
                const id = input.value;
                document.getElementById('yt-video-area').innerHTML = `
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe>
                `;
            };
        }, 100);
    }
};