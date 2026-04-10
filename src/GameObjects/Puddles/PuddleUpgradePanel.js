import Phaser from 'phaser';

export default class PuddleUpgradePanel {
    constructor(scene, onPurchaseUpgrade, onClaimReward) {
        this.scene = scene;
        this.onPurchaseUpgrade = onPurchaseUpgrade;
        this.onClaimReward = onClaimReward;
        this.currentPuddle = null;
        this.currentUpgrade = null;
        this.isVisible = false;

        this._build();
        this._bindInput();
        this.hide();
    }

    _build() {
        const width = 320;
        const height = 220;
        const x = this.scene.scale.width - width - 24;
        const y = 180;

        this.container = this.scene.add.container(0, 0).setScrollFactor(0).setDepth(9300);

        this.panelBg = this.scene.add.rectangle(x, y, width, height, 0x101522, 0.86);
        this.panelBg.setOrigin(0, 0);
        this.panelBg.setStrokeStyle(2, 0x4f7bbf, 0.95);

        this.titleText = this.scene.add.text(x + 16, y + 14, 'PUDDLE UPGRADES', {
            fontFamily: 'ReturnOfTheBoss',
            fontSize: '24px',
            color: '#eaf2ff',
            stroke: '#000000',
            strokeThickness: 4
        });

        this.descText = this.scene.add.text(x + 16, y + 68, 'Move speed +10%', {
            fontFamily: 'ReturnOfTheBoss',
            fontSize: '20px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });

        this.costText = this.scene.add.text(x + 16, y + 108, 'Cost: 1 feather', {
            fontFamily: 'ReturnOfTheBoss',
            fontSize: '18px',
            color: '#ffe18a',
            stroke: '#000000',
            strokeThickness: 4
        });

        this.buttonBg = this.scene.add.rectangle(x + 16, y + 150, width - 32, 44, 0x2f67b8, 0.95);
        this.buttonBg.setOrigin(0, 0);
        this.buttonBg.setStrokeStyle(2, 0xbcd8ff, 1);

        this.claimButtonBg = this.scene.add.rectangle(x + 16, y + 200, width - 32, 44, 0x2f8b4f, 0.95);
        this.claimButtonBg.setOrigin(0, 0);
        this.claimButtonBg.setStrokeStyle(2, 0x8eff8e, 1);

        this.buttonText = this.scene.add.text(x + width / 2, y + 172, 'BUY UPGRADE', {
            fontFamily: 'ReturnOfTheBoss',
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.claimButtonText = this.scene.add.text(x + width / 2, y + 222, 'CLAIM REWARD (+3)', {
            fontFamily: 'ReturnOfTheBoss',
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.messageText = this.scene.add.text(x + 16, y + 198, '', {
            fontFamily: 'ReturnOfTheBoss',
            fontSize: '15px',
            color: '#ffb3b3',
            stroke: '#000000',
            strokeThickness: 3
        });

        this.container.add([
            this.panelBg,
            this.titleText,
            this.descText,
            this.costText,
            this.buttonBg,
            this.buttonText,
            this.claimButtonBg,
            this.claimButtonText,
            this.messageText
        ]);
    }

    show(puddle, duck) {
        this.currentPuddle = puddle;
        this.currentUpgrade = puddle?.getPrimaryUpgrade?.() ?? null;

        if (!this.currentUpgrade) {
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
        this.currentUpgrade = null;
        this._setMessage('');
    }

    update(duck) {
        if (!this.container?.visible || !this.currentUpgrade) return;
        this._refresh(duck);
    }

    _refresh(duck) {
        const cost = this.currentUpgrade.costFeathers ?? 0;
        const canBuy = duck?.hasFeathers?.(cost) ?? false;

        this.descText.setText(this.currentUpgrade.label || 'Upgrade');
        this.costText.setText(`Cost: ${cost} feather${cost === 1 ? '' : 's'}`);
        this.costText.setColor(canBuy ? '#ffe18a' : '#ff9696');

        this.buttonBg.setFillStyle(canBuy ? 0x2f67b8 : 0x555555, 0.95);
        this.buttonText.setAlpha(canBuy ? 1 : 0.75);

        if (canBuy) {
            this._setMessage('');
        } else {
            this._setMessage('Need more feathers');
        }
    }

    _setMessage(message) {
        if (this.messageText) {
            this.messageText.setText(message || '');
        }
    }

    showPurchaseResult(success, message = '') {
        if (success) {
            this._setMessage(message || 'Upgrade purchased');
            return;
        }

        this._setMessage(message || 'Purchase failed');
    }

    _bindInput() {
        this._onPointerUp = (pointer) => {
            if (!this.isVisible || !this.currentPuddle || !this.currentUpgrade || typeof this.onPurchaseUpgrade !== 'function') {
                return;
            }

            if (!Phaser.Geom.Rectangle.Contains(this._getButtonBounds(), pointer.x, pointer.y)) {
                if (Phaser.Geom.Rectangle.Contains(this._getClaimButtonBounds(), pointer.x, pointer.y) && typeof this.onClaimReward === 'function') {
                    this.onClaimReward(this.currentPuddle);
                }
                return;
            }

            this.onPurchaseUpgrade(this.currentPuddle, this.currentUpgrade.id);
        };

        this.scene.input.on('pointerup', this._onPointerUp);
    }

    _getButtonBounds() {
        return new Phaser.Geom.Rectangle(
            this.buttonBg.x,
            this.buttonBg.y,
            this.buttonBg.width,
            this.buttonBg.height
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

        if (this.buttonBg) {
            this.buttonBg.removeAllListeners();
        }

        if (this.claimButtonBg) {
            this.claimButtonBg.removeAllListeners();
        }

        if (this.container) {
            this.container.destroy(true);
            this.container = null;
        }

        this.currentPuddle = null;
        this.currentUpgrade = null;
        this.scene = null;
        this.onPurchaseUpgrade = null;
        this.onClaimReward = null;
    }
}
