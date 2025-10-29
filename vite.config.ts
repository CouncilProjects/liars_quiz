import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fs from "fs";
// this to put the plugin
import {SvelteKitPWA} from "@vite-pwa/sveltekit"
export default defineConfig({
	plugins: [
		tailwindcss(), 
		sveltekit(),
		SvelteKitPWA({
			registerType:'autoUpdate',
			manifest:{
				name:'Liars Quiz',
				short_name:'Liars',
				start_url:'/',
				display:'standalone',
				background_color: '#ffffff',
				theme_color: '#4f46e5',
				icons:[
					{
						src:"/icon/size192app.png",
						sizes:'192x192',
						type:'image/png'
					},
					{
						src:"/icon/size512app.png",
						sizes:'512x512',
						type:'image/png'
					}
				]
			},
			 workbox: {
        		globPatterns: ["**/*"], // ✅ preload EVERYTHING
        		navigateFallback: "/index.html", // ✅ needed for SvelteKit SPA mode
      		}
		})],
		

		
      		server: {
        		https: {
          			key: fs.readFileSync('./localhost-key.pem'),
          			cert: fs.readFileSync('./localhost.pem')
        		},
        		host: true,
				port:5000
      		}
    	
});
