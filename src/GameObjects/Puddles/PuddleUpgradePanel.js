import Phaser from 'phaser';

export default class PuddleUpgradePanel {
    constructor(scene, onPurchaseUpgrade, onClaimReward) {
        this.scene = scene;
        this.onPurchaseUpgrade = onPurchaseUpgrade;
        this.onClaimReward = onClaimReward;
        this.currentPuddle = null;
        this.currentUpgrades = [];
        this.isVisible = false;
        this.upgradeRows = [];

        this._build();
        this._bindInput();
        this.hide();
    }

    _getLayout() {
        const width = Math.max(Math.round(this.scene.scale.width * 0.32), 380);
        const x = this.scene.scale.width - width - 24;
        const y = 178;
        const height = Math.max(this.scene.scale.height - y - 24, 460);
        const topSectionHeight = Math.round(height * 0.74);
        const bottomSectionHeight = height - topSectionHeight;

        return {
            width,
            height,
            x,
            y,
            radius: 18,
            topSectionHeight,
            bottomSectionHeight,
            dividerY: y + topSectionHeight
        };
    }

    _build() {
        const layout = this._getLayout();
        const { width, height, x, y, radius, topSectionHeight, bottomSectionHeight, dividerY } = layout;

        this.container = this.scene.add.container(0, 0).setScrollFactor(0).setDepth(9300);

        this.panelBg = this.scene.add.graphics();
        this.panelBg.fillStyle(0x6a431f, 0.78);
        this.panelBg.fillRoundedRect(x, y, width, height, radius);
        this.panelBg.lineStyle(4, 0xe4c46a, 1);
        this.panelBg.strokeRoundedRect(x, y, width, height, radius);

        this.panelInset = this.scene.add.graphics();
        this.panelInset.lineStyle(2, 0x8f6a22, 0.95);
        this.panelInset.strokeRoundedRect(x + 8, y + 8, width - 16, height - 16, Math.max(radius - 4, 10));

        this.titleText = this.scene.add.text(x + width / 2, y + 18, '¡¡¡SPLASH!!!', {
            fontFamily: 'ReturnOfTheBoss',
            fontSize: '30px',
            color: '#ffe38e',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5, 0);

        this.topPanelBg = this.scene.add.rectangle(
            x + 10,
            y + 52,
            width - 20,
            topSectionHeight - 60,
            0x4a2b13,
            0.12
        );
        this.topPanelBg.setOrigin(0, 0);

        this.bottomPanelBg = this.scene.add.rectangle(
            x + 10,
            dividerY + 8,
            width - 20,
            bottomSectionHeight - 18,
            0x3e2310,
            0.12
        );
        this.bottomPanelBg.setOrigin(0, 0);

        this.sectionDivider = this.scene.add.rectangle(
            x + 14,
            dividerY,
            width - 28,
            4,
            0xe4c46a,
            1
        );
        this.sectionDivider.setOrigin(0, 0);

        this.sectionDividerGlow = this.scene.add.rectangle(
            x + 16,
            dividerY + 5,
            width - 32,
            1,
            0xfff2b3,
            0.65
        );
        this.sectionDividerGlow.setOrigin(0, 0);

        this.upgradeHeaderText = this.scene.add.text(x + 24, y + 78, 'MEJORAS CON PLUMAS', {
            fontFamily: 'ReturnOfTheBoss',
            fontSize: '24px',
            color: '#f8e7b5',
            stroke: '#000000',
            strokeThickness: 4
        });

        const rowGap = 12;
        const rowX = x + 18;
        const rowWidth = width - 36;
        const rowStartY = y + 118;
        const rowBottomLimit = dividerY - 14;
        const availableTopRowsHeight = Math.max(1, rowBottomLimit - rowStartY);
        const rowHeight = Math.max(112, Math.floor((availableTopRowsHeight - rowGap * 2) / 3));
        const buttonHeight = Math.max(58, rowHeight - 26);
        const buttonWidth = 150;
        const buttonFillColor = 0x3f2615;
        const buttonStrokeColor = 0xcda349;

        for (let index = 0; index < 3; index++) {
            const rowY = rowStartY + index * (rowHeight + rowGap);

            const rowBg = this.scene.add.rectangle(rowX, rowY, rowWidth, rowHeight, 0x000000, 0.10);
            rowBg.setOrigin(0, 0);
            rowBg.setStrokeStyle(2, 0x8f6a22, 0.85);

            const nameText = this.scene.add.text(rowX + 14, rowY + 10, '', {
                fontFamily: 'ReturnOfTheBoss',
                fontSize: '34px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 5
            });

            // Calculamos el espacio máximo para el texto restando el ancho del botón y un poco de margen
            const maxTextWidth = rowWidth - buttonWidth - 40;

            const descText = this.scene.add.text(rowX + 14, rowY + 56, '', {
                fontFamily: 'ReturnOfTheBoss',
                fontSize: '22px',
                color: '#f8e7b5',
                stroke: '#000000',
                strokeThickness: 4,
                wordWrap: { width: maxTextWidth, useAdvancedWrap: true }, // <-- AQUÍ ESTÁ LA MAGIA
                lineSpacing: 2 // Añadido para que las líneas no se peguen mucho
            });

            const buttonBg = this.scene.add.rectangle(
                rowX + rowWidth - buttonWidth - 10,
                rowY + Math.floor((rowHeight - buttonHeight) / 2),
                buttonWidth,
                buttonHeight,
                buttonFillColor,
                0.95
            );
            buttonBg.setOrigin(0, 0);
            buttonBg.setStrokeStyle(3, buttonStrokeColor, 1);

            const priceText = this.scene.add.text(
                buttonBg.x + (buttonWidth / 2) - 16,
                buttonBg.y + buttonHeight / 2,
                '1',
                {
                    fontFamily: 'ReturnOfTheBoss',
                    fontSize: '30px',
                    color: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 5
                }
            ).setOrigin(0.5);

            const featherIcon = this.scene.add.image(
                buttonBg.x + (buttonWidth / 2) + 8,
                buttonBg.y + buttonHeight / 2,
                'feather_icon'
            );
            featherIcon.setOrigin(0, 0.5);
            featherIcon.setScale(0.16);

            this.upgradeRows.push({
                rowBg,
                nameText,
                descText,
                buttonBg,
                priceText,
                featherIcon,
                upgradeId: null
            });
        }

        this.rewardHeaderText = this.scene.add.text(x + width / 2, dividerY + 14, 'DESTRUIR EL CHARQUITO', {
            fontFamily: 'ReturnOfTheBoss',
            fontSize: '30px',
            color: '#f8e7b5',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5, 0);

        this.rewardText = this.scene.add.text(x + width / 2, dividerY + 58, '¡Adiós al punto de control PERO GANAS PLUMAS!', {
            fontFamily: 'ReturnOfTheBoss',
            fontSize: '22px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5, 0);

        this.claimButtonBg = this.scene.add.rectangle(x + 18, dividerY + 112, width - 36, 82, 0x3f2615, 0.95);
        this.claimButtonBg.setOrigin(0, 0);
        this.claimButtonBg.setStrokeStyle(3, 0xcda349, 1);

        this.claimButtonText = this.scene.add.text(x + width / 2 - 18, dividerY + 152, '+2', {
            fontFamily: 'ReturnOfTheBoss',
            fontSize: '34px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.claimButtonFeatherIcon = this.scene.add.image(x + width / 2 + 16, dividerY + 152, 'feather_icon');
        this.claimButtonFeatherIcon.setOrigin(0, 0.5);
        this.claimButtonFeatherIcon.setScale(0.18);

        this.messageText = this.scene.add.text(x + 24, y + height - 42, '', {
            fontFamily: 'ReturnOfTheBoss',
            fontSize: '17px',
            color: '#ffb3b3',
            stroke: '#000000',
            strokeThickness: 4
        });

        const rowDisplayObjects = this.upgradeRows.flatMap(row => [
            row.rowBg,
            row.nameText,
            row.descText,
            row.buttonBg,
            row.priceText,
            row.featherIcon
        ]);

        this.container.add([
            this.panelBg,
            this.panelInset,
            this.topPanelBg,
            this.bottomPanelBg,
            this.sectionDivider,
            this.sectionDividerGlow,
            this.titleText,
            this.upgradeHeaderText,
            ...rowDisplayObjects,
            this.rewardHeaderText,
            this.rewardText,
            this.claimButtonBg,
            this.claimButtonText,
            this.claimButtonFeatherIcon,
            this.messageText
        ]);
    }

    show(puddle, duck) {
        this.currentPuddle = puddle;
        this.currentUpgrades = puddle?.getAvailableUpgrades?.() ?? [];

        if (this.currentUpgrades.length === 0) {
            this.hide();
            return;
        }

        this.isVisible = true;
        this.container.setVisible(true);
        this._refresh(duck);
    }

    hide() {
        if (this.container) {
            this.container.setVisible(false);
        }
        this.isVisible = false;
        this.currentPuddle = null;
        this.currentUpgrades = [];
        this._setMessage('');
    }

    update(duck) {
        if (!this.container?.visible) return;
        this.currentUpgrades = this.currentPuddle?.getAvailableUpgrades?.() ?? [];
        if (this.currentUpgrades.length === 0) {
            this.hide();
            return;
        }
        this._refresh(duck);
    }

    _refresh(duck) {
        this.upgradeRows.forEach((row, index) => {
            const upgrade = this.currentUpgrades[index] || null;
            const rowVisible = !!upgrade;

            row.upgradeId = upgrade?.id || null;
            row.rowBg.setVisible(rowVisible);
            row.nameText.setVisible(rowVisible);
            row.descText.setVisible(rowVisible);
            row.buttonBg.setVisible(rowVisible);
            row.priceText.setVisible(rowVisible);
            row.featherIcon.setVisible(rowVisible);

            if (!upgrade) {
                return;
            }

            const cost = Math.max(0, Number(upgrade.costFeathers) || 0);
            const canBuy = duck?.hasFeathers?.(cost) ?? false;

            row.nameText.setText(String(upgrade.label || '').toUpperCase());
            row.descText.setText(upgrade.description || '');
            row.priceText.setText(`- ${cost}`);

            row.buttonBg.setFillStyle(canBuy ? 0x3f2615 : 0x555555, 0.95);
            row.priceText.setAlpha(canBuy ? 1 : 0.75);
            row.featherIcon.setAlpha(canBuy ? 1 : 0.75);
        });

        const canBuyAny = this.currentUpgrades.some(upgrade => {
            const cost = Math.max(0, Number(upgrade?.costFeathers) || 0);
            return duck?.hasFeathers?.(cost) ?? false;
        });

        if (canBuyAny) {
            this._setMessage('');
        } else {
            this._setMessage('Necesitas mas plumas');
        }
    }

    _setMessage(message) {
        if (this.messageText) {
            this.messageText.setText(message || '');
        }
    }

    showPurchaseResult(success, message = '') {
        if (success) {
            this._setMessage(message || 'Mejora comprada');
            return;
        }

        this._setMessage(message || 'Compra fallida');
    }

    _bindInput() {
        this._onPointerUp = (pointer) => {
            if (!this.isVisible || !this.currentPuddle) {
                return;
            }

            if (
                Phaser.Geom.Rectangle.Contains(this._getClaimButtonBounds(), pointer.x, pointer.y) &&
                typeof this.onClaimReward === 'function'
            ) {
                this.onClaimReward(this.currentPuddle);
                return;
            }

            if (typeof this.onPurchaseUpgrade !== 'function') {
                return;
            }

            const clickedRow = this.upgradeRows.find(row => (
                row.upgradeId && Phaser.Geom.Rectangle.Contains(this._getUpgradeButtonBounds(row), pointer.x, pointer.y)
            ));

            if (!clickedRow?.upgradeId) {
                return;
            }

            this.onPurchaseUpgrade(this.currentPuddle, clickedRow.upgradeId);
        };

        this.scene.input.on('pointerup', this._onPointerUp);
    }

    _getUpgradeButtonBounds(row) {
        return new Phaser.Geom.Rectangle(
            row.buttonBg.x,
            row.buttonBg.y,
            row.buttonBg.width,
            row.buttonBg.height
        );
    }

    _getClaimButtonBounds() {
        return new Phaser.Geom.Rectangle(
            this.claimButtonBg.x,
            this.claimButtonBg.y,
            this.claimButtonBg.width,
            this.claimButtonBg.height
        );
    }

    destroy() {
        if (this.scene?.input && this._onPointerUp) {
            this.scene.input.off('pointerup', this._onPointerUp);
            this._onPointerUp = null;
        }

        if (this.container) {
            this.container.destroy(true);
            this.container = null;
        }

        this.currentPuddle = null;
        this.currentUpgrades = [];
        this.upgradeRows = [];
        this.scene = null;
        this.onPurchaseUpgrade = null;
        this.onClaimReward = null;
    }
}
