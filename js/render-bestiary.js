class RenderBestiary{static _getRenderedSection(sectionTrClass,sectionEntries,sectionLevel){const renderer=Renderer.get();const renderStack=[];if(sectionTrClass==="lairaction"||sectionTrClass==="regionaleffect"){renderer.recursiveRender({entries:sectionEntries},renderStack,{depth:sectionLevel+2})}else if(sectionTrClass==="legendary"||sectionTrClass==="mythic"){const cpy=MiscUtil.copy(sectionEntries).map((it=>{if(it.name&&it.entries){it.name=`${it.name}.`;it.type=it.type||"item"}return it}));const toRender={type:"list",style:"list-hang-notitle",items:cpy};renderer.recursiveRender(toRender,renderStack,{depth:sectionLevel})}else{sectionEntries.forEach((e=>{if(e.rendered)renderStack.push(e.rendered);else renderer.recursiveRender(e,renderStack,{depth:sectionLevel+1})}))}return`<tr class="${sectionTrClass}"><td colspan="6" class="mon__sect-row-inner">${renderStack.join("")}</td></tr>`}static _getPronunciationButton(mon){return`<button class="btn btn-xs btn-default btn-name-pronounce ml-2">\n\t\t\t<span class="glyphicon glyphicon-volume-up name-pronounce-icon"></span>\n\t\t\t<audio class="name-pronounce">\n\t\t\t   <source src="${Renderer.utils.getMediaUrl(mon,"soundClip","audio")}" type="audio/mpeg">\n\t\t\t</audio>\n\t\t</button>`}static $getRenderedCreature(mon,options){const renderer=Renderer.get();return Renderer.monster.getRenderWithPlugins({renderer:renderer,mon:mon,fn:()=>RenderBestiary._$getRenderedCreature(mon,options,renderer)})}static _$getRenderedCreature(mon,options,renderer){options=options||{};Renderer.monster.initParsed(mon);const fnGetSpellTraits=Renderer.monster.getSpellcastingRenderedTraits.bind(Renderer.monster,renderer);const allTraits=Renderer.monster.getOrderedTraits(mon,{fnGetSpellTraits:fnGetSpellTraits});const allActions=Renderer.monster.getOrderedActions(mon,{fnGetSpellTraits:fnGetSpellTraits});const legGroup=DataUtil.monster.getMetaGroup(mon);const renderedVariants=(()=>{const dragonVariant=Renderer.monster.getDragonCasterVariant(renderer,mon);const variants=mon.variant;if(!variants&&!dragonVariant)return null;else{const rStack=[];(variants||[]).forEach((v=>renderer.recursiveRender(v,rStack)));if(dragonVariant)rStack.push(dragonVariant);return`<td colspan=6>${rStack.join("")}</td>`}})();const htmlSourceAndEnvironment=(()=>{const srcCpy={source:mon.source,page:mon.page,srd:mon.srd,sourceSub:mon.sourceSub,otherSources:mon.otherSources,additionalSources:mon.additionalSources,externalSources:mon.externalSources};const additional=mon.additionalSources?MiscUtil.copy(mon.additionalSources):[];if(mon.variant&&mon.variant.length>1){mon.variant.forEach((v=>{if(v.variantSource){additional.push({source:v.variantSource.source,page:v.variantSource.page})}}))}srcCpy.additionalSources=additional;const pageTrInner=Renderer.utils.getSourceAndPageTrHtml(srcCpy);if(mon.environment&&mon.environment.length){return[pageTrInner,`<div class="mb-1 mt-2"><b>Environment:</b> ${mon.environment.sort(SortUtil.ascSortLower).map((it=>it.toTitleCase())).join(", ")}</div>`]}else{return[pageTrInner]}})();const hasToken=mon.tokenUrl&&mon.uniqueId||mon.hasToken;const extraThClasses=hasToken?["mon__name--token"]:null;return $$`
		${Renderer.utils.getBorderTr()}
		${Renderer.utils.getExcludedTr(mon,"monster",UrlUtil.PG_BESTIARY)}
		${Renderer.utils.getNameTr(mon,{controlRhs:mon.soundClip?RenderBestiary._getPronunciationButton(mon):"",extraThClasses:extraThClasses,page:UrlUtil.PG_BESTIARY,extensionData:{_scaledCr:mon._scaledCr,_scaledSummonLevel:mon._scaledSummonLevel}})}
		<tr><td colspan="6">
			<div ${hasToken?`class="mon__wrp-size-type-align--token"`:""}><i>${Renderer.monster.getTypeAlignmentPart(mon)}</i></div>
		</td></tr>
		<tr><td class="divider" colspan="6"><div></div></td></tr>

		<tr><td colspan="6"><div ${hasToken?`class="mon__wrp-avoid-token"`:""}><strong>Armor Class</strong> ${Parser.acToFull(mon.ac)}</div></td></tr>
		<tr><td colspan="6"><div ${hasToken?`class="mon__wrp-avoid-token"`:""}><strong>Hit Points</strong> ${Renderer.monster.getRenderedHp(mon.hp)}</div></td></tr>
		<tr><td colspan="6"><strong>Speed</strong> ${Parser.getSpeedString(mon)}</td></tr>
		<tr><td class="divider" colspan="6"><div></div></td></tr>

		<tr class="mon__ability-names">
			<th>STR</th><th>DEX</th><th>CON</th><th>INT</th><th>WIS</th><th>CHA</th>
		</tr>
		<tr class="mon__ability-scores">
			${Parser.ABIL_ABVS.map((ab=>`<td>${Renderer.utils.getAbilityRoller(mon,ab)}</td>`)).join("")}
		</tr>
		<tr><td class="divider" colspan="6"><div></div></td></tr>

		${mon.save?`<tr><td colspan="6"><strong>Saving Throws</strong> ${Renderer.monster.getSavesPart(mon)}</td></tr>`:""}
		${mon.skill?`<tr><td colspan="6"><strong>Skills</strong> ${Renderer.monster.getSkillsString(renderer,mon)}</td></tr>`:""}
		${mon.vulnerable?`<tr><td colspan="6"><strong>Damage Vulnerabilities</strong> ${Parser.getFullImmRes(mon.vulnerable)}</td></tr>`:""}
		${mon.resist?`<tr><td colspan="6"><strong>Damage Resistances</strong> ${Parser.getFullImmRes(mon.resist)}</td></tr>`:""}
		${mon.immune?`<tr><td colspan="6"><strong>Damage Immunities</strong> ${Parser.getFullImmRes(mon.immune)}</td></tr>`:""}
		${mon.conditionImmune?`<tr><td colspan="6"><strong>Condition Immunities</strong> ${Parser.getFullCondImm(mon.conditionImmune)}</td></tr>`:""}
		<tr><td colspan="6"><strong>Senses</strong> ${Renderer.monster.getSensesPart(mon)}</td></tr>
		<tr><td colspan="6"><strong>Languages</strong> ${Renderer.monster.getRenderedLanguages(mon.languages)}</td></tr>

		<tr>${Parser.crToNumber(mon.cr)<VeCt.CR_UNKNOWN?$$`
		<td colspan="3" class="relative"><strong>Challenge</strong>
			<span>${Parser.monCrToFull(mon.cr,{isMythic:!!mon.mythic})}</span>
			${options.$btnScaleCr||""}
			${options.$btnResetScaleCr||""}
		</td>
		`:`<td colspan="3" class="relative"><strong>Challenge</strong> <span>—</span></td>`}${mon.pbNote||Parser.crToNumber(mon.cr)<VeCt.CR_UNKNOWN?`<td colspan="3" class="text-right"><strong>Proficiency Bonus (PB)</strong> ${mon.pbNote??UiUtil.intToBonus(Parser.crToPb(mon.cr))}</td>`:""}</tr>

		<tr>${options.selSummonSpellLevel?$$`<td colspan="6"><strong>Spell Level</strong> ${options.selSummonSpellLevel}</td>`:""}</tr>

		${allTraits?`<tr><td class="divider" colspan="6"><div></div></td></tr>${RenderBestiary._getRenderedSection("trait",allTraits,1)}`:""}
		${allActions?`<tr><td colspan="6" class="mon__stat-header-underline"><span class="mon__sect-header-inner">Actions${mon.actionNote?` (<span class="small">${mon.actionNote}</span>)`:""}</span></td></tr>\n\t\t${RenderBestiary._getRenderedSection("action",allActions,1)}`:""}
		${mon.bonus?`<tr><td colspan="6" class="mon__stat-header-underline"><span class="mon__sect-header-inner">Bonus Actions</span></td></tr>\n\t\t${RenderBestiary._getRenderedSection("bonus",mon.bonus,1)}`:""}
		${mon.reaction?`<tr><td colspan="6" class="mon__stat-header-underline"><span class="mon__sect-header-inner">Reactions</span></td></tr>\n\t\t${RenderBestiary._getRenderedSection("reaction",mon.reaction,1)}`:""}
		${mon.legendary?`<tr><td colspan="6" class="mon__stat-header-underline"><span class="mon__sect-header-inner">Legendary Actions</span></td></tr>\n\t\t<tr class="legendary"><td colspan="6"><span class="name"></span> <span>${Renderer.monster.getLegendaryActionIntro(mon)}</span></td></tr>\n\t\t${RenderBestiary._getRenderedSection("legendary",mon.legendary,1)}`:""}
		${mon.mythic?`<tr><td colspan="6" class="mon__stat-header-underline"><span class="mon__sect-header-inner">Mythic Actions</span></td></tr>\n\t\t<tr class="mythic"><td colspan="6"><span class="name"></span> <span>${Renderer.monster.getMythicActionIntro(mon)}</span></td></tr>\n\t\t${RenderBestiary._getRenderedSection("mythic",mon.mythic,1)}`:""}

		${legGroup&&legGroup.lairActions?`<tr><td colspan="6" class="mon__stat-header-underline"><span class="mon__sect-header-inner">Lair Actions</span></td></tr>\n\t\t${RenderBestiary._getRenderedSection("lairaction",legGroup.lairActions,-1)}`:""}
		${legGroup&&legGroup.regionalEffects?`<tr><td colspan="6" class="mon__stat-header-underline"><span class="mon__sect-header-inner">Regional Effects</span></td></tr>\n\t\t${RenderBestiary._getRenderedSection("regionaleffect",legGroup.regionalEffects,-1)}`:""}

		${renderedVariants?`<tr>${renderedVariants}</tr>`:""}
		${mon.footer?`<tr><td colspan=6 class="mon__sect-row-inner">${renderer.render({entries:mon.footer})}</td></tr>`:""}
		${mon.summonedBySpell?`<tr><td colspan="6"><b>Summoned By:</b> ${renderer.render(`{@spell ${mon.summonedBySpell}}`)}</td></tr>`:""}
		${htmlSourceAndEnvironment.length===2?`<tr><td colspan="6">${htmlSourceAndEnvironment[1]}</td></tr>`:""}
		<tr><td colspan="6">${htmlSourceAndEnvironment[0]}</td></tr>
		${Renderer.utils.getBorderTr()}`}static $getRenderedLegendaryGroup(legGroup){return $$`
		${Renderer.utils.getBorderTr()}
		${Renderer.utils.getNameTr(legGroup)}
		<tr class="text"><td colspan="6" class="text">
			${legGroup.lairActions&&legGroup.lairActions.length?Renderer.get().render({type:"entries",entries:[{type:"entries",name:"Lair Actions",entries:legGroup.lairActions}]}):""}
			${legGroup.regionalEffects&&legGroup.regionalEffects.length?Renderer.get().render({type:"entries",entries:[{type:"entries",name:"Regional Effects",entries:legGroup.regionalEffects}]}):""}
			${legGroup.mythicEncounter&&legGroup.mythicEncounter.length?Renderer.get().render({type:"entries",entries:[{type:"entries",name:`<i title="This will display the creature's name when this legendary group is referenced from a creature statblock." class="help-subtle">&lt;Creature Name&gt;</i> as a Mythic Encounter`,entries:legGroup.mythicEncounter}]}):""}
		</td></tr>
		${Renderer.utils.getBorderTr()}`}}