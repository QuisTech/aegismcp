"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AEGIS_SCENES } from '@/lib/scenes';

declare global {
  interface Window {
    startScene: (id: string) => void;
    activeSceneId: string;
  }
}

export default function SceneController() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    window.startScene = (id: string) => {
      const scene = AEGIS_SCENES.find(s => s.id === id);
      if (!scene) {
        console.warn(`[SceneController] Unknown scene ID: ${id}`);
        return;
      }

      console.log(`🎬 [SceneController] Triggering scene: ${scene.name} (${id}) on route ${scene.route}`);
      window.activeSceneId = id;
      
      // Navigate if route differs
      if (scene.route !== pathname) {
        router.push(scene.route);
        // Wait briefly for navigation to commit, then dispatch event
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('aegis-scene-change', { detail: { id } }));
        }, 500);
      } else {
        window.dispatchEvent(new CustomEvent('aegis-scene-change', { detail: { id } }));
      }
    };

    // Dispatch initial event if there's a pre-set scene on navigation
    if (window.activeSceneId) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('aegis-scene-change', { detail: { id: window.activeSceneId } }));
      }, 500);
    }

    return () => {
      // Clean up reference if unmounted
    };
  }, [router, pathname]);

  return null;
}
