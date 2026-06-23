/* formats.js — DATA layer. File format → possible folders.
   Many formats are AMBIGUOUS (a .png can be a frame grab, a logo, or your export),
   so each format maps to one or more {dest, when} options. The search shows them all.
   Value shapes: {opts:[[dest, when?], ...]}  ·  {note:"..."} (cache / bundle). */
window.FORMAT_MAP = (function(){
  // reusable option sets
  var S = ['04_Graphics/03_Stills', 'a photo or frame grab'],
      R = ['04_Graphics/01_Resources', 'a logo, reference or brand asset'],
      B = ['04_Graphics/02_Built', 'a graphic you made / exported'];
  var raster   = {opts: [S, R, B]};                       // png/jpg/tif…
  var photoRaw = {opts: [['04_Graphics/03_Stills', 'a camera photo (raw)']]};
  var vector   = {opts: [R, B]};                          // svg/ai/eps
  var design   = {opts: [B, R]};                          // psd/psb
  var video    = {opts: [
      ['02_Footage', 'footage — by source: Originals / Stock / AI / Provided'],
      ['00_Deliver', "a cut you deliver (newest → 01_Master, rest → 02_Versions)"],
      ['05_Intermediates', 'a render you can recreate (transcode, pull, draft)']]};
  var audio    = {opts: [
      ['03_Audio', 'by role — Production / VO / SFX / Music'],
      ['03_Audio/05_Processed', 'if cleaned externally (Adobe Podcast, etc.)'],
      ['05_Intermediates', 'a transient bounce/render you can recreate']]};
  var TL   = {opts: [['01_Project/02_Timelines', 'interchange — DRT / XML / AAF / EDL']]};
  var LU   = {opts: [['01_Project/03_LUTs', 'a color LUT']]};
  var RS   = {opts: [['01_Project/01_Resolve', 'the Resolve project / backup']]};
  var FONT = {opts: [['04_Graphics/01_Resources', 'a font']]};
  var SUB  = {opts: [['00_Deliver', 'subtitle sidecar — next to its version']]};
  var DOC  = {opts: [['06_Documents', 'paperwork / notes']]};
  var INT  = {opts: [['05_Intermediates', 'working / render — recreatable from the project']]};
  var SESS = {opts: [
      ['05_Intermediates', "an audio bounce/render"],
      ['01_Project', "a session/project file you keep (if you work in it)"]]};
  var CACHE  = {note: 'auto-generated cache — keep it next to its media, you never file this by hand'};
  var BUNDLE = {note: 'a bundle — unzip it first, then file each file by its type'};
  return {
    // raster images — ambiguous within Graphics
    png:raster, jpg:raster, jpeg:raster, jfif:raster, tif:raster, tiff:raster, tga:raster,
    bmp:raster, gif:raster, webp:raster, avif:raster, heic:raster, heif:raster, ico:raster, icns:raster,
    // camera raw photos → Stills
    cr2:photoRaw, cr3:photoRaw, nef:photoRaw, arw:photoRaw, dng:photoRaw, raf:photoRaw,
    rw2:photoRaw, orf:photoRaw, pef:photoRaw, sr2:photoRaw, dcr:photoRaw, raw:photoRaw,
    // vector / design source
    svg:vector, ai:vector, eps:vector, cdr:vector, indd:vector, ind:vector, idml:vector,
    psd:design, psb:design,
    // fonts
    ttf:FONT, otf:FONT, ttc:FONT, woff:FONT, woff2:FONT,
    // video — ambiguous (footage vs deliverable vs render)
    mov:video, mp4:video, mpeg:video, mpg:video, m4v:video, m2v:video, mxf:video, mts:video, m2ts:video,
    avi:video, wmv:video, mkv:video, flv:video, vob:video, ogv:video, webm:video, dv:video,
    '3gp':video, '3gpp':video, braw:video, r3d:video,
    // audio — by role (+ Processed / Intermediates)
    wav:audio, mp3:audio, m4a:audio, aif:audio, aiff:audio, aac:audio, ac3:audio,
    flac:audio, ogg:audio, wma:audio, midi:audio, bwf:audio, caf:audio, m3u:audio,
    // project / interchange / luts
    drp:RS, drt:TL, xml:TL, aaf:TL, edl:TL, fcpxml:TL, otio:TL, omf:TL, fcp:TL,
    cube:LU, '3dl':LU, lut:LU,
    // subtitles → Deliver
    srt:SUB, vtt:SUB, scc:SUB, smi:SUB, ttml:SUB, stl:SUB, sub:SUB, lrc:SUB,
    // documents
    pdf:DOC, doc:DOC, docx:DOC, dotx:DOC, txt:DOC, rtf:DOC, md:DOC, csv:DOC, tsv:DOC,
    xls:DOC, xlsx:DOC, numbers:DOC, pages:DOC, key:DOC, ppt:DOC, pptx:DOC, pps:DOC,
    html:DOC, eml:DOC, ps:DOC, xps:DOC, json:DOC,
    // comps / renders / other-app projects
    dpx:INT, exr:INT, prproj:INT, aep:INT, aet:INT, motn:INT, ncor:INT, mogrt:INT, epr:INT,
    nk:INT, c4d:INT, blend:INT, tvai:INT,
    // audio sessions
    rpp:SESS, sesx:SESS, ses:SESS, ptx:SESS, ptf:SESS, reason:SESS, asnd:SESS,
    // auto-generated cache / sidecars
    xmp:CACHE, cfa:CACHE, pek:CACHE, pkf:CACHE, lrprev:CACHE, lrcat:CACHE, db:CACHE, tmp:CACHE,
    log:CACHE, plist:CACHE, ini:CACHE, dat:CACHE, bin:CACHE, rsrc:CACHE, wfm:CACHE, reapeaks:CACHE, reapindex:CACHE,
    // bundles
    zip:BUNDLE, rar:BUNDLE, '7z':BUNDLE
  };
})();
