/* formats.js — DATA layer. File format → folder map. Source of truth: the Archive.
   To add a format: drop one line in the right group. Nothing else to touch. */
window.FORMAT_MAP = (function(){
  var F='02_Footage', FO=['02_Footage','01_Originals'], A='03_Audio', G='04_Graphics',
      GS=['04_Graphics','03_Stills'], GR=['04_Graphics','01_Resources'],
      TL=['01_Project','02_Timelines'], RS=['01_Project','01_Resolve'], LU=['01_Project','03_LUTs'],
      DEL='00_Deliver', DOC='06_Documents', INT='05_Intermediates',
      CACHE={note:'auto-generated cache — keep it next to its media, you never file this by hand'},
      BUNDLE={note:'a bundle — unzip it first, then file each file by its type'};
  return {
    // video → 02_Footage (pick the subfolder by source)
    mov:F, mp4:F, mpeg:F, mpg:F, m4v:F, m2v:F, mxf:F, mts:F, m2ts:F, avi:F, wmv:F, mkv:F,
    flv:F, vob:F, ogv:F, webm:F, dv:F, '3gp':F, '3gpp':F, braw:F, r3d:F, ari:F, crm:F, cine:F, insv:F,
    // camera-card structure — keep the whole card in Originals
    cpi:FO, bdm:FO, bup:FO, ifo:FO, mpl:FO, bim:FO, thm:FO, lrv:FO, spu:FO,
    // audio → 03_Audio (pick the subfolder by role)
    wav:A, mp3:A, m4a:A, aif:A, aiff:A, aac:A, ac3:A, flac:A, ogg:A, wma:A, midi:A, m3u:A, bwf:A, caf:A,
    // audio sessions / projects
    sesx:A, ses:A, ptx:A, ptf:A, rpp:A, asnd:A, reason:A,
    // stills / photo → 04_Graphics/03_Stills
    png:GS, jpg:GS, jpeg:GS, jfif:GS, heic:GS, heif:GS, webp:GS, avif:GS, tif:GS, tiff:GS,
    tga:GS, bmp:GS, gif:GS, ico:GS, icns:GS,
    arw:GS, nef:GS, cr2:GS, cr3:GS, rw2:GS, dng:GS, orf:GS, raf:GS, pef:GS, sr2:GS, dcr:GS, raw:GS,
    // design / graphics source → 04_Graphics
    psd:G, psb:G, ai:G, eps:G, svg:G, cdr:G, indd:G, ind:G, idml:G, fla:G, swf:G,
    ttf:GR, otf:GR, ttc:GR, woff:GR, woff2:GR,
    // timelines / interchange → 01_Project/02_Timelines
    xml:TL, edl:TL, drt:TL, aaf:TL, omf:TL, fcp:TL, fcpxml:TL, otio:TL,
    drp:RS,
    cube:LU, '3dl':LU, lut:LU,
    // subtitles → 00_Deliver
    srt:DEL, vtt:DEL, scc:DEL, smi:DEL, ttml:DEL, stl:DEL, sub:DEL, lrc:DEL,
    // documents → 06_Documents
    pdf:DOC, doc:DOC, docx:DOC, dotx:DOC, txt:DOC, rtf:DOC, md:DOC, csv:DOC, tsv:DOC, xls:DOC, xlsx:DOC,
    numbers:DOC, pages:DOC, key:DOC, ppt:DOC, pptx:DOC, pps:DOC, html:DOC, eml:DOC, ps:DOC, xps:DOC, json:DOC,
    // comps / renders / other-app projects → 05_Intermediates
    dpx:INT, exr:INT, prproj:INT, aep:INT, aet:INT, motn:INT, ncor:INT, mogrt:INT, epr:INT,
    nk:INT, c4d:INT, blend:INT, tvai:INT,
    // auto-generated cache / sidecars — never filed by hand
    xmp:CACHE, cfa:CACHE, pek:CACHE, pkf:CACHE, lrprev:CACHE, lrcat:CACHE, db:CACHE, tmp:CACHE,
    log:CACHE, plist:CACHE, ini:CACHE, dat:CACHE, bin:CACHE, rsrc:CACHE, wfm:CACHE,
    // bundles
    zip:BUNDLE, rar:BUNDLE, '7z':BUNDLE
  };
})();
